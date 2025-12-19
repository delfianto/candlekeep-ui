<script setup lang="ts">
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  MessageSquare,
  Users,
  BookOpen,
  Settings,
  Moon,
  Sun,
  Database
} from 'lucide-vue-next'
import { useColorMode } from '@vueuse/core'

// -- THEME LOGIC --
// We use VueUse's useColorMode for robust dark/light switching
const mode = useColorMode()
const toggleTheme = () => {
  mode.value = mode.value === 'dark' ? 'light' : 'dark'
}

// -- NAVIGATION DATA --
// Easy to extend array for your menu items.
// 'active' should eventually be driven by your vue-router route.path
const navItems = [
  { label: 'Chat', icon: MessageSquare, route: '/chat', active: true },
  { label: 'Characters', icon: Users, route: '/characters', active: false },
  { label: 'World Info', icon: BookOpen, route: '/world', active: false },
  { label: 'RAG / Memory', icon: Database, route: '/memory', active: false }, // Added based on your "Backend" interests
]
</script>

<template>
  <TooltipProvider>
    <SidebarProvider :default-open="false">
      <Sidebar collapsible="icon" class="hidden md:flex border-r border-border">
        <SidebarHeader class="flex items-center justify-center py-4">
          <div
            class="h-8 w-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg"
          >
            C
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in navItems" :key="item.label">
              <SidebarMenuButton
                :tooltip="item.label"
                :isActive="item.active"
                class="transition-all duration-200"
              >
                <component :is="item.icon" />
                <span>{{ item.label }}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton @click="toggleTheme" tooltip="Toggle Theme">
                <component :is="mode === 'dark' ? Sun : Moon" />
                <span>{{ mode === 'dark' ? 'Light Mode' : 'Dark Mode' }}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <main class="flex-1 flex flex-col h-screen overflow-hidden bg-background w-full">
        <div class="flex-1 h-full w-full overflow-hidden relative">
          <slot />
        </div>

        <nav
          class="md:hidden border-t border-border bg-card flex justify-around items-center h-16 shrink-0 px-2 safe-area-bottom"
        >
          <Button
            v-for="item in navItems"
            :key="item.label"
            variant="ghost"
            size="icon"
            :class="{'text-primary bg-accent/50': item.active}"
          >
            <component :is="item.icon" class="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" @click="toggleTheme">
            <component :is="mode === 'dark' ? Sun : Moon" class="h-5 w-5" />
          </Button>
        </nav>
      </main>
    </SidebarProvider>
  </TooltipProvider>
</template>

<style scoped>
/* Ensures the bottom bar respects iPhone home bar area */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
