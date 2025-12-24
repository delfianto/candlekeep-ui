<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  name: string
  class?: string
}>(), {
  // Default Tailwind size
  class: 'size-4'
})

// Load all SVGs from the assets folder as raw strings
// 'as: raw' gives us the SVG code string instead of a URL
// 'eager: true' loads them at startup (no async flicker for small icons)
const icons = import.meta.glob('@/assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true
})

const iconContent = computed(() => {
  const path = `/src/assets/icons/${props.name.toLowerCase()}.svg`
  const rawIcon = icons[path] as string | undefined

  if (!rawIcon) {
    console.warn(`BrandIcon: Icon "${props.name}" not found at ${path}`)
    return ''
  }

  // OPTIONAL: Strip hardcoded width/height so Tailwind classes control the size
  return rawIcon
    .replace(/width=".*?"/g, '')
    .replace(/height=".*?"/g, '')
})
</script>

<template>
  <span
    v-if="iconContent"
    :class="['inline-block align-middle [&>svg]:w-full [&>svg]:h-full', props.class]"
    v-html="iconContent"
  />
  <span v-else :class="['bg-muted rounded-full', props.class]" />
</template>
