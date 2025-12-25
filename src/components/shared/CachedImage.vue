<script setup lang="ts">
import { useAssetCache } from '@/composables/useAssetCache'

const props = defineProps<{
  src: string
  alt?: string
}>()

const { src: resolvedSrc } = useAssetCache(() => props.src)
</script>

<template>
  <img v-if="resolvedSrc" :src="resolvedSrc" :alt="alt" />
</template>
