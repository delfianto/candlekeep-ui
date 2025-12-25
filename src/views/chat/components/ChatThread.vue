<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import {
  MessageSquare,
  MoreVertical,
  Paperclip,
  Send,
  User,
  Loader2
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import CharacterAvatar from '@/components/shared/CharacterAvatar.vue'
import { Textarea } from '@/components/ui/textarea'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useChatMessages } from '@/composables/useChatMessages'
import MarkdownRenderer from '@/components/shared/MarkdownRenderer.vue'
import type { components } from '@/api/schema'

type Chat = components['schemas']['ChatResponse']

const props = defineProps<{
  chatId: string | null
  currentChat: Chat | null
}>()

const emit = defineEmits<{
  (e: 'openCharacterInspector'): void
  (e: 'openSettings'): void
}>()

const { messages, loading, hasMore, loadMore, error } = useChatMessages(() => props.chatId, {
  pageSize: 20,
  autoLoad: true
})

const inputValue = ref('')
const scrollContainer = ref<HTMLDivElement | null>(null)
const isInitialLoad = ref(true)

// Reset initial load flag when chat changes
watch(() => props.chatId, () => {
  isInitialLoad.value = true
})

// Reliable Scroll to Bottom (Native Div)
const scrollToBottom = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }
}

watch(messages, async (newVal, oldVal) => {
  // Scenario 1: Initial Load (New Chat selected)
  if (isInitialLoad.value && newVal.length > 0) {
    await nextTick()
    scrollToBottom()

    // Double-tap for delayed layout shifts (images/fonts)
    setTimeout(() => {
      scrollToBottom()
      isInitialLoad.value = false
    }, 100)
  }
  // Scenario 2: User sent a new message (List grew by 1 at the end)
  else if (!isInitialLoad.value && newVal.length > oldVal.length && newVal[newVal.length - 1].role === 'user') {
    await nextTick()
    scrollToBottom()
  }
})

// Reliable Load More (Native Scroll Calculation)
const handleLoadMore = async () => {
  if (!scrollContainer.value) return

  const container = scrollContainer.value
  const previousScrollHeight = container.scrollHeight
  const previousScrollTop = container.scrollTop

  await loadMore()

  await nextTick()

  // Restore scroll position relative to the new content
  const newScrollHeight = container.scrollHeight
  const heightDifference = newScrollHeight - previousScrollHeight
  container.scrollTop = previousScrollTop + heightDifference
}
</script>

<template>
  <div class="flex flex-col h-full min-h-0 bg-background">
    <header
      class="flex items-center justify-between px-6 py-3 border-b shrink-0 h-16 bg-card/30 backdrop-blur"
    >
      <div class="flex items-center gap-3">
        <Sheet>
          <SheetTrigger as-child>
            <Button variant="ghost" size="icon" class="md:hidden -ml-2">
              <MessageSquare class="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left"><p>Mobile Menu</p></SheetContent>
        </Sheet>

        <CharacterAvatar
          :src="currentChat?.avatar_thumbnail_path"
          :username="currentChat?.character_name || currentChat?.title"
          class="size-9 cursor-pointer hover:opacity-80 transition-opacity"
          fallback-class="text-xs"
          @click="emit('openCharacterInspector')"
        />
        <div class="flex flex-col">
          <h2 class="text-sm font-semibold leading-none mb-1">
            {{ currentChat?.character_name || currentChat?.title || 'Keeper of Candlekeep' }}
          </h2>
          <p class="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <span
              class="size-1.5 rounded-full"
              :class="
                currentChat && !currentChat.model_id
                  ? 'bg-red-500'
                  : 'bg-green-500 animate-pulse'
              "
            ></span>
            {{ currentChat?.model_name || 'Active Session' }}
            <span v-if="currentChat && !currentChat.model_id" class="text-red-500 font-medium">
              (Invalid Model)
            </span>
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="ghost" size="icon" @click="emit('openSettings')">
          <MoreVertical class="size-5" />
        </Button>
      </div>
    </header>

    <div
      ref="scrollContainer"
      class="flex-1 p-4 sm:p-6 bg-background overflow-y-auto custom-scrollbar"
    >
      <div class="flex flex-col max-w-3xl mx-auto w-full pb-4">
        <div v-if="error" class="text-center py-4 text-red-500 text-sm">
          Error: {{ error.message }}
        </div>

        <div v-if="hasMore && !loading" class="flex justify-center mb-8">
          <Button
            @click="handleLoadMore"
            variant="outline"
            size="sm"
            class="rounded-full px-6 text-xs h-8"
          >
            Load older messages
          </Button>
        </div>

        <div v-if="loading && messages.length > 0" class="flex justify-center mb-8">
          <Loader2 class="size-5 animate-spin text-muted-foreground/50" />
        </div>

        <div
          v-if="!loading && messages.length === 0"
          class="flex-1 flex flex-col items-center justify-center py-20 text-center opacity-40"
        >
          <MessageSquare class="size-12 mb-4" />
          <p class="text-sm font-medium">No messages yet.</p>
        </div>

        <div class="flex flex-col gap-8">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="flex gap-4 group"
            :class="{ 'flex-row-reverse': msg.role === 'user' }"
          >
            <CharacterAvatar
              v-if="msg.role === 'assistant'"
              :src="currentChat?.avatar_thumbnail_path"
              :username="currentChat?.character_name || currentChat?.title"
              class="size-9 mt-0.5"
              fallback-class="text-xs"
            />
            <Avatar v-else class="size-9 shrink-0 border shadow-sm mt-0.5">
              <AvatarFallback class="bg-muted">
                <User class="size-5" />
              </AvatarFallback>
            </Avatar>

            <div class="flex flex-col gap-1.5 max-w-[85%] lg:max-w-[75%]">
              <div
                class="flex items-center gap-2 px-1"
                :class="{ 'flex-row-reverse': msg.role === 'user' }"
              >
                <span class="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
                  {{ msg.role === 'assistant' ? (currentChat?.character_name || 'Assistant') : 'You' }}
                </span>
                <span class="text-[10px] text-muted-foreground/40 font-medium">
                  {{ new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                </span>
              </div>

              <div
                class="p-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm border transition-shadow group-hover:shadow-md"
                :class="msg.role === 'user'
                  ? 'bg-primary text-primary-foreground border-primary rounded-tr-none'
                  : 'bg-card border-border rounded-tl-none'"
              >
                <MarkdownRenderer
                  :content="msg.content"
                  :class="{ 'prose-invert': msg.role === 'user' }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="chatId" class="p-4 border-t bg-background/50 backdrop-blur shrink-0">
      <div
        class="max-w-3xl mx-auto relative flex items-end gap-2 p-2 rounded-2xl border bg-card shadow-sm focus-within:ring-2 ring-primary/10 transition-all"
      >
        <Button
          variant="ghost"
          size="icon"
          class="size-10 text-muted-foreground hover:text-foreground shrink-0 rounded-xl"
        >
          <Paperclip class="size-5" />
        </Button>
        <Textarea
          v-model="inputValue"
          placeholder="Write your response..."
          class="min-h-10 max-h-48 border-0 focus-visible:ring-0 resize-none bg-transparent py-3 shadow-none text-sm"
        />
        <Button size="icon" class="size-10 shrink-0 rounded-xl shadow-lg">
          <Send class="size-5" />
        </Button>
      </div>
      <div class="text-center mt-3">
        <p class="text-[10px] text-muted-foreground/60 font-medium">
          Transcribing to the Great Library of Candlekeep
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* CSS to make the native div scrollbar look like Shadcn/Radix */
.custom-scrollbar::-webkit-scrollbar {
  width: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: hsl(var(--muted-foreground) / 0.1);
  border-radius: 9999px;
  border: 3px solid transparent;
  background-clip: content-box;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: hsl(var(--muted-foreground) / 0.3);
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--muted-foreground) / 0.1) transparent;
}
</style>
