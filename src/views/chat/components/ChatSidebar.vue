<script setup lang="ts">
import type { components } from '@/api/schema'
import {
  Search,
  Plus,
  Loader2
} from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import CharacterAvatar from '@/components/shared/CharacterAvatar.vue'

type Chat = components['schemas']['ChatResponse']

defineProps<{
  chatSessions: Chat[]
  loading: boolean
  hasMore: boolean
  selectedChatId: string | null
}>()

const emit = defineEmits<{
  (e: 'loadMore'): void
  (e: 'selectChat', id: string): void
}>()
</script>

<template>
  <div class="h-full flex flex-col min-h-0">
    <div
      class="p-4 flex items-center justify-between shrink-0 h-16 border-b bg-background/50 backdrop-blur"
    >
      <h2 class="font-bold text-lg tracking-tight">Chats</h2>
      <Button size="icon" variant="ghost">
        <Plus class="size-5" />
      </Button>
    </div>

    <div class="p-4 py-2 shrink-0">
      <div class="relative">
        <Search class="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input placeholder="Search chats..." class="pl-9 bg-background" />
      </div>
    </div>

    <ScrollArea class="flex-1 min-h-0" type="hover">
      <div
        v-if="loading && chatSessions.length === 0"
        class="flex flex-col items-center justify-center p-8"
      >
        <Loader2 class="size-6 animate-spin text-muted-foreground mb-2" />
        <p class="text-xs text-muted-foreground">Loading chats...</p>
      </div>

      <div v-else class="flex flex-col gap-1 p-2">
        <button
          v-for="chat in chatSessions"
          :key="chat.id"
          class="flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-accent group relative overflow-hidden shrink-0"
          :class="{ 'bg-accent shadow-sm': chat.id === selectedChatId }"
          @click="emit('selectChat', chat.id)"
        >
          <div
            v-if="chat.id === selectedChatId"
            class="absolute left-0 top-0 bottom-0 w-1 bg-primary"
          />

          <CharacterAvatar
            :src="chat.avatar_thumbnail_path"
            :username="chat.character_name || chat.title"
            class="size-16"
            fallback-class="text-base"
          />

          <div class="flex-1 min-w-0 flex flex-col gap-0.5">
            <div class="flex items-center justify-between w-full">
              <span
                class="font-semibold text-sm truncate pr-2"
                :class="chat.id === selectedChatId ? 'text-foreground' : 'text-foreground/80'"
              >
                {{ chat.title }}
              </span>
              <span class="text-[10px] opacity-70 shrink-0">
                {{ new Date(chat.updated_at).toLocaleDateString() }}
              </span>
            </div>

            <div class="flex flex-col gap-0.5 w-full">
              <span class="text-xs line-clamp-2 opacity-60 leading-snug">
                {{ chat.preview || 'No messages yet...' }}
              </span>
            </div>
          </div>
        </button>

        <div v-if="hasMore" class="p-2 pt-0">
          <Button
            variant="ghost"
            size="sm"
            class="w-full text-xs text-muted-foreground hover:text-foreground h-8"
            :disabled="loading"
            @click="emit('loadMore')"
          >
            <Loader2 v-if="loading" class="mr-2 h-3 w-3 animate-spin" />
            {{ loading ? 'Loading...' : 'Load older chats' }}
          </Button>
        </div>
      </div>
    </ScrollArea>
  </div>
</template>
