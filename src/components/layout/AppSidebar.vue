<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { MessageSquare, Users, Sliders, BookOpen } from 'lucide-vue-next'
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { icon: MessageSquare, label: 'Chat', to: '/' },
  { icon: Users, label: 'Characters', to: '/characters' },
  { icon: Sliders, label: 'Presets', to: '/presets' },
  { icon: BookOpen, label: 'Lorebooks', to: '/lorebooks' },
]

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <aside class="w-64 border-r bg-muted/20 h-full flex flex-col">
    <div class="p-4 border-b h-14 flex items-center">
      <span class="font-bold text-lg tracking-tight px-2">Candlekeep</span>
    </div>

    <ScrollArea class="flex-1">
      <nav class="flex flex-col gap-1 p-3">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          custom
          v-slot="{ navigate }"
        >
          <Button
            :variant="isActive(item.to) ? 'secondary' : 'ghost'"
            class="justify-start gap-3 w-full"
            @click="navigate"
          >
            <component :is="item.icon" class="h-4 w-4" />
            {{ item.label }}
          </Button>
        </RouterLink>
      </nav>
    </ScrollArea>

    <div class="p-4 border-t text-xs text-muted-foreground text-center">v0.2.0 Skeleton</div>
  </aside>
</template>
