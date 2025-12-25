<script setup lang="ts">
import { type Component } from 'vue'

defineProps<{
  title?: string
  icon?: Component
}>()
</script>

<template>
  <div
    class="md:hidden sticky -top-4 -mx-4 -mt-4 p-4 z-30 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/60 border-b flex items-center justify-between mb-4"
  >
    <div class="flex items-center gap-2 min-w-0">
      <component :is="icon" v-if="icon" class="size-5 shrink-0" />
      <h2 class="text-lg font-semibold truncate">
        <slot name="title">
          {{ title }}
        </slot>
      </h2>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>
