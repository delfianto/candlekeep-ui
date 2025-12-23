<script setup lang="ts">
/**
 * CONTENT LAYOUT WRAPPER
 * Standardizes page spacing, scrolling, and alignment across the app.
 * This will act as root element for all other view.
 */
withDefaults(defineProps<{
  /**
   * - 'standard': (Default) Scrollable, padded, constrained width. Best for Forms, Settings, Docs.
   * - 'full': No padding, no scroll, full height. Best for Chat, Maps, Split Panes.
   * - 'center': Vertically & Horizontally centered. Best for 404, Loading, Login.
   */
  variant?: 'standard' | 'full' | 'center'

  title?: string
  subtitle?: string
}>(), {
  variant: 'standard'
})
</script>

<template>
  <div v-if="variant === 'standard'" class="h-full w-full overflow-y-auto bg-background/50">
    <div
      class="container mx-auto max-w-7xl p-4 md:p-8 lg:p-10 space-y-8 animate-in fade-in duration-300"
    >
      <div v-if="title || $slots.header" class="flex flex-col gap-2">
        <h1 v-if="title" class="text-3xl font-bold tracking-tight">{{ title }}</h1>
        <p v-if="subtitle" class="text-muted-foreground">{{ subtitle }}</p>
        <slot name="header" />
      </div>

      <slot />
    </div>
  </div>

  <div v-else-if="variant === 'full'" class="h-full w-full overflow-hidden flex flex-col">
    <slot />
  </div>

  <div
    v-else-if="variant === 'center'"
    class="h-full w-full flex flex-col items-center justify-center p-4 bg-muted/10"
  >
    <div class="max-w-md w-full space-y-4 text-center">
      <slot />
    </div>
  </div>
</template>
