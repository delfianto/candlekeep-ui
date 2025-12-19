<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Moon, Sun, Menu } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'

const emit = defineEmits<{ toggleSidebar: [] }>()
const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <header
    class="h-14 border-b bg-background/95 backdrop-blur flex items-center px-4 justify-between sticky top-0 z-50"
  >
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" @click="emit('toggleSidebar')">
        <Menu class="h-5 w-5" />
      </Button>
      <h1 class="font-semibold text-sm md:text-base">Active Session</h1>
    </div>

    <div class="flex items-center gap-2">
      <Button variant="ghost" size="icon" @click="toggleTheme">
        <Moon v-if="!isDark" class="h-5 w-5" />
        <Sun v-else class="h-5 w-5" />
      </Button>
    </div>
  </header>
</template>
