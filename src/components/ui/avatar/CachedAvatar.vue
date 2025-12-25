<script setup lang="ts">
import { AvatarImage, type AvatarImageProps } from 'reka-ui'
import { useAssetCache } from '@/composables/useAssetCache'

const props = defineProps<AvatarImageProps>()

// Intercept the src prop to load it via our cache mechanism
const { src: resolvedSrc } = useAssetCache(() => props.src)
</script>

<template>
  <!-- 
    We default to '' if resolvedSrc is undefined.
    Reka UI's AvatarImage will handle the empty src by showing the fallback.
    Once resolvedSrc becomes available (blob:...), it will render the image.
  -->
  <AvatarImage
    data-slot="avatar-image"
    v-bind="props"
    :src="resolvedSrc ?? ''"
    class="aspect-square size-full object-cover"
  >
    <slot />
  </AvatarImage>
</template>
