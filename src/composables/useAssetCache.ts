import { ref, watchEffect, onScopeDispose, toValue, type MaybeRefOrGetter } from "vue";

const CACHE_NAME = "candlekeep-assets-v1";

export function useAssetCache(urlSource: MaybeRefOrGetter<string | undefined | null>) {
  const cachedSrc = ref<string | undefined>(undefined);
  const error = ref<Error | null>(null);

  // Track the previous blob URL to clean it up when it's replaced
  let previousUrl: string | undefined;

  onScopeDispose(() => {
    if (previousUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previousUrl);
    }
  });

  watchEffect(async (onCleanup) => {
    const url = toValue(urlSource);
    let isCancelled = false;

    onCleanup(() => {
      isCancelled = true;
    });

    // Reset state
    error.value = null;

    // If no URL, clear cache and return
    if (!url) {
      cachedSrc.value = undefined;
      return;
    }

    try {
      // Check for Cache API support
      if (typeof window === "undefined" || !("caches" in window)) {
        cachedSrc.value = url;
        return;
      }

      const cache = await caches.open(CACHE_NAME);

      if (isCancelled) return;

      const cachedResponse = await cache.match(url);

      if (isCancelled) return;

      if (cachedResponse) {
        const blob = await cachedResponse.blob();
        if (isCancelled) return;

        const newUrl = URL.createObjectURL(blob);

        // Clean up previous blob if it exists
        if (previousUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(previousUrl);
        }
        previousUrl = newUrl;
        cachedSrc.value = newUrl;
      } else {
        // Fetch from network
        const response = await fetch(url);

        if (isCancelled) return;

        if (!response.ok) throw new Error(`Failed to load asset: ${response.statusText}`);

        // Cache the response
        try {
          await cache.put(url, response.clone());
        } catch (err) {
          console.warn("Failed to cache asset:", err);
        }

        const blob = await response.blob();
        if (isCancelled) return;

        const newUrl = URL.createObjectURL(blob);

        if (previousUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(previousUrl);
        }
        previousUrl = newUrl;
        cachedSrc.value = newUrl;
      }
    } catch (e) {
      if (isCancelled) return;

      console.warn("Asset cache failed, falling back to network url:", e);
      error.value = e as Error;
      cachedSrc.value = url;
    }
  });

  return {
    src: cachedSrc,
    error,
  };
}
