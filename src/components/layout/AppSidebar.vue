<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
  SidebarMenuButton
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import AppSidebarButton from './AppSidebarButton.vue'
import {
  Home,
  MessageSquare,
  Users,
  BookOpen,
  Database,
  Settings,
  Moon,
  Sun,
  Flame,
} from 'lucide-vue-next'
import { useColorMode } from '@vueuse/core'
import { useRoute } from 'vue-router'

const mode = useColorMode()
const route = useRoute()

const toggleTheme = () => {
  mode.value = mode.value === 'dark' ? 'light' : 'dark'
}

const navItems = [
  { label: 'Home', icon: Home, route: '/' },
  { label: 'Chats', icon: MessageSquare, route: '/chats' },
  { label: 'Characters', icon: Users, route: '/characters' },
  { label: 'World Lore', icon: BookOpen, route: '/world' },
  { label: 'Memory', icon: Database, route: '/memory' },
]
</script>

<template>
  <Sidebar collapsible="icon" class="border-r border-border bg-card/30">
    <SidebarHeader
      class="flex items-center justify-between py-4 mb-4 group-data-[collapsible=icon]:justify-center"
    >
      <div class="flex items-center gap-3 transition-all overflow-hidden">
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
      <SidebarMenu class="gap-1 px-2 group-data-[collapsible=icon]:gap-6">
        <SidebarMenuItem v-for="item in navItems" :key="item.label">
          <RouterLink :to="item.route">
            <AppSidebarButton
              :label="item.label"
              :icon="item.icon"
              :isActive="item.route === '/' ? route.path === '/' : route.path.startsWith(item.route)"
            />
          </RouterLink>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu class="gap-1 group-data-[collapsible=icon]:gap-6">
        <SidebarMenuItem>
          <AppSidebarButton
            :label="mode === 'dark' ? 'Light Mode' : 'Dark Mode'"
            :icon="mode === 'dark' ? Sun : Moon"
            @click="toggleTheme"
          />
        </SidebarMenuItem>

        <RouterLink to="/settings">
          <SidebarMenuItem>
            <AppSidebarButton
              label="Settings"
              :icon="Settings"
              :isActive="route.path.startsWith('/settings')"
            />
          </SidebarMenuItem>
        </RouterLink>

        <div class="px-2 my-1 group-data-[collapsible=icon]:hidden">
          <Separator class="bg-border/50" />
        </div>

        <SidebarMenuItem>
          <RouterLink to="/persona">
            <SidebarMenuButton
              tooltip="Active Persona"
              :isActive="route.path === '/persona'"
              class="h-14 gap-4 transition-all duration-200 group-data-[collapsible=icon]:justify-center"
            >
              <Avatar class="h-8 w-8 shrink-0 rounded-lg border">
                <AvatarImage src="/avatar-placeholder.png" alt="User" />
                <AvatarFallback class="rounded-lg">DM</AvatarFallback>
              </Avatar>
              <div
                class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden"
              >
                <span class="truncate font-semibold">Dungeon Master</span>
                <span class="truncate text-xs text-muted-foreground">Level 20</span>
              </div>
            </SidebarMenuButton>
          </RouterLink>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
