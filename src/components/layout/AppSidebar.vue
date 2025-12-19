<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar'
import AppSidebarButton from './AppSidebarButton.vue'
import {
  MessageSquare,
  Users,
  BookOpen,
  Settings,
  Moon,
  Sun,
  Database,
  Flame,
} from 'lucide-vue-next'
import { useColorMode } from '@vueuse/core'

const mode = useColorMode()

const toggleTheme = () => {
  mode.value = mode.value === 'dark' ? 'light' : 'dark'
}

const navItems = [
  { label: 'Chat', icon: MessageSquare, route: '/chat', active: true },
  { label: 'Characters', icon: Users, route: '/characters', active: false },
  { label: 'World Info', icon: BookOpen, route: '/world', active: false },
  { label: 'Memory', icon: Database, route: '/memory', active: false },
]
</script>

<template>
  <Sidebar collapsible="icon" class="border-r border-border bg-card/30">
    <SidebarHeader
      class="flex items-center justify-between py-4 group-data-[collapsible=icon]:justify-center"
    >
      <div class="flex items-center gap-2 transition-all overflow-hidden">
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
        >
          <Flame class="size-8" />
        </div>
        <span class="font-bold text-lg truncate group-data-[collapsible=icon]:hidden">
          Candlekeep
        </span>
      </div>
    </SidebarHeader>

    <SidebarContent>
      <SidebarMenu class="gap-2 px-2">
        <SidebarMenuItem v-for="item in navItems" :key="item.label">
          <AppSidebarButton :label="item.label" :icon="item.icon" :isActive="item.active" />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu class="gap-2">
        <SidebarMenuItem>
          <AppSidebarButton
            :label="mode === 'dark' ? 'Light Mode' : 'Dark Mode'"
            :icon="mode === 'dark' ? Sun : Moon"
            @click="toggleTheme"
          />
        </SidebarMenuItem>

        <SidebarMenuItem>
          <AppSidebarButton label="Settings" :icon="Settings" />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
