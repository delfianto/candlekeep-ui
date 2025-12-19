<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'

const isSidebarOpen = ref(true)
</script>

<template>
  <div class="flex h-screen w-full bg-background text-foreground overflow-hidden">
    <div v-if="isSidebarOpen" class="hidden md:block h-full">
      <AppSidebar />
    </div>

    <div class="flex-1 flex flex-col h-full overflow-hidden">
      <AppHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

      <main class="flex-1 overflow-auto p-4 md:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
