<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar'
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
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
        >
          <Flame class="size-6" />
        </div>

        <span class="font-bold text-lg truncate group-data-[collapsible=icon]:hidden">
          Candlekeep
        </span>
      </div>
    </SidebarHeader>

    <SidebarContent>
      <SidebarMenu class="gap-2 px-2">
        <SidebarMenuItem v-for="item in navItems" :key="item.label">
          <SidebarMenuButton
            :tooltip="item.label"
            :isActive="item.active"
            class="h-10 transition-all duration-200 group-data-[collapsible=icon]:justify-center"
          >
            <component :is="item.icon" class="size-5 shrink-0" />

            <span class="group-data-[collapsible=icon]:hidden">
              {{ item.label }}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu class="gap-2">
        <SidebarMenuItem>
          <SidebarMenuButton
            @click="toggleTheme"
            tooltip="Toggle Theme"
            class="h-10 transition-all group-data-[collapsible=icon]:justify-center"
          >
            <component :is="mode === 'dark' ? Sun : Moon" class="size-5 shrink-0" />
            <span class="group-data-[collapsible=icon]:hidden">
              {{ mode === 'dark' ? 'Light Mode' : 'Dark Mode' }}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Settings"
            class="h-10 transition-all group-data-[collapsible=icon]:justify-center"
          >
            <Settings class="size-5 shrink-0" />
            <span class="group-data-[collapsible=icon]:hidden">Settings</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
