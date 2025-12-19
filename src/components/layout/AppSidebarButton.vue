<script setup lang="ts">
import { SidebarMenuButton } from '@/components/ui/sidebar'
import type { Component } from 'vue'

// explicit props for strict typing
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
    class="h-14 gap-4 transition-all duration-200 group-data-[collapsible=icon]:justify-center"
  >
    <component :is="icon" class="size-7! shrink-0" />

    <span class="group-data-[collapsible=icon]:hidden">
      {{ label }}
    </span>
  </SidebarMenuButton>
</template>
