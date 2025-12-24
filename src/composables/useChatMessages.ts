// src/composables/useChatMessages.ts
import { ref, watch } from "vue";
import type { components } from "@/api/schema";

type Message = components["schemas"]["MessageResponse"];

interface UseChatMessagesOptions {
  pageSize?: number;
  autoLoad?: boolean;
}

export function useChatMessages(getChatId: () => string | null, options: UseChatMessagesOptions = {}) {
  const { pageSize = 50, autoLoad = true } = options;

  const messages = ref<Message[]>([]);
  const loading = ref(false);
  const hasMore = ref(true);
  const error = ref<Error | null>(null);

  const loadMessages = async (cursor?: string) => {
    const currentChatId = getChatId();
    if (!currentChatId) return;

    loading.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams();
      params.append("limit", pageSize.toString());
      if (cursor) {
        params.append("cursor", cursor);
      }

      const response = await fetch(
        `/api/chats/${currentChatId}/messages?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to load messages: ${response.statusText}`);
      }

      const data = await response.json();
      // Handle both old array format (just in case) and new object format
      const newMessages: Message[] = Array.isArray(data) ? data : data.items;
      const meta = Array.isArray(data) ? null : data.meta;

      if (meta) {
        hasMore.value = meta.has_more;
      } else {
        // Fallback for old API or missing meta
        const hasMoreHeader = response.headers.get("X-Has-More");
        if (hasMoreHeader !== null) {
          hasMore.value = hasMoreHeader === "true";
        } else {
           if (newMessages.length < pageSize) {
             hasMore.value = false;
           }
        }
      }

      // The API returns Newest -> Oldest.
      // We want to display Oldest -> Newest.
      const sortedBatch = [...newMessages].reverse();

      if (cursor) {
        // Prepend older messages
        messages.value = [...sortedBatch, ...messages.value];
      } else {
        // Initial load (replace)
        messages.value = sortedBatch;
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error("Unknown error");
      console.error("Error loading messages:", err);
    } finally {
      loading.value = false;
    }
  };

  const loadMore = async () => {
    if (hasMore.value && !loading.value && messages.value.length > 0) {
      // Use the timestamp of the oldest message (first in the list) as the cursor
      const oldestMessage = messages.value[0];
      await loadMessages(oldestMessage.created_at);
    }
  };

  const refresh = () => {
    messages.value = [];
    hasMore.value = true;
    loadMessages();
  };

  // Watch for chatId changes and reload if needed
  watch(
    () => getChatId(),
    (newChatId) => {
      if (autoLoad && newChatId) {
        messages.value = [];
        hasMore.value = true;
        loadMessages();
      } else {
        // If chatId becomes null, clear the messages
        messages.value = [];
        hasMore.value = false;
      }
    },
    { immediate: true },
  );

  return {
    messages,
    loading,
    hasMore,
    error,
    loadMore,
    refresh,
  };
}
