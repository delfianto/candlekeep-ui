<script setup lang="ts">
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import AppSidebar from './AppSidebar.vue'
import { Button } from '@/components/ui/button'
import { MessageCircleMore, Users, NotebookText, Sun, Moon } from 'lucide-vue-next'
import { useColorMode } from '@vueuse/core'

const mode = useColorMode()
const toggleTheme = () => {
  mode.value = mode.value === 'dark' ? 'light' : 'dark'
}

const navItems = [
  { label: 'Chat', icon: MessageCircleMore, route: '/chat' },
  { label: 'Characters', icon: Users, route: '/characters' },
  { label: 'World Info', icon: NotebookText, route: '/world' },
]
</script>

<template>
  <SidebarProvider>
    <AppSidebar />

    <SidebarInset class="flex flex-col h-screen overflow-hidden bg-background w-full">
      <div class="flex-1 h-full w-full overflow-hidden relative">
        <router-view />
      </div>

      <nav
        class="md:hidden border-t border-border bg-card flex justify-around items-center h-16 shrink-0 px-2 safe-area-bottom"
      >
        <Button v-for="item in navItems" :key="item.label" variant="ghost" size="icon">
          <component :is="item.icon" class="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" @click="toggleTheme">
          <component :is="mode === 'dark' ? Sun : Moon" class="h-5 w-5" />
        </Button>
      </nav>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>
:deep(:root), :deep(.group\/sidebar-wrapper) {
  --sidebar-width-icon: 5rem;
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
