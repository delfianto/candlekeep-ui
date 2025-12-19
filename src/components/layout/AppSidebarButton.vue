<script setup lang="ts">
import { SidebarMenuButton } from '@/components/ui/sidebar'
import type { Component } from 'vue'

defineProps<{
  label: string
  icon: Component
  isActive?: boolean
  tooltip?: string
}>()
</script>

<template>
  <SidebarMenuButton
    :tooltip="tooltip || label"
    :isActive="isActive"
    class="group/button h-14 gap-4 transition-all duration-200 group-data-[collapsible=icon]:justify-center"
  >
    <component
      :is="icon"
      class="size-7! shrink-0 transition-colors"
      :class="isActive ? 'text-primary' : 'text-muted-foreground group-hover/button:text-foreground'"
    />

    <span
      class="group-data-[collapsible=icon]:hidden transition-colors"
      :class="isActive ? 'font-semibold text-primary' : 'text-muted-foreground group-hover/button:text-foreground'"
    >
      {{ label }}
    </span>
  </SidebarMenuButton>
</template>
