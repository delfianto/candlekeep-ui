<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMediaQuery } from '@vueuse/core'
import { useChatMessages } from '@/composables/useChatMessages'
import { useChatSessions } from '@/composables/useChatSessions'
import {
  Search,
  Plus,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Send,
  Bot,
  User,
  Loader2
} from 'lucide-vue-next'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'
import CharacterInspector from '@/components/shared/CharacterInspector.vue'

const router = useRouter()
const route = useRoute()
const chatId = computed(() => route.params.chatId as string || null)
const isMobile = useMediaQuery('(max-width: 768px)')
const showCharacterInspector = ref(false)

const {
  chatSessions,
  loading: chatsLoading,
  hasMore: chatsHasMore,
  loadMore: loadMoreChats,
} = useChatSessions({ pageSize: 20 })

const currentChat = computed(() => {
  return chatSessions.value.find((c) => c.id === chatId.value) || null
})

// Auto-select first chat if none selected and chats are loaded
watch(chatSessions, (newChats) => {
  if (!chatId.value && newChats.length > 0) {
    router.replace(`/chats/${newChats[0].id}`)
  }
}, { immediate: true })

const handleCharacterClick = () => {
  if (!currentChat.value) return

  if (isMobile.value) {
    router.push({ name: 'character-detail', params: { id: currentChat.value.character_id } })
  } else {
    showCharacterInspector.value = true
  }
}

const { messages, loading, hasMore, loadMore, error } = useChatMessages(() => chatId.value, {
  pageSize: 20,
  autoLoad: true
})

const inputValue = ref('')
const scrollContainer = ref<HTMLDivElement | null>(null)
const isInitialLoad = ref(true)

// Reset initial load flag when chat changes
watch(chatId, () => {
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
  <div class="h-full w-full bg-background overflow-hidden flex flex-col">
    <ResizablePanelGroup direction="horizontal" class="flex-1 items-stretch overflow-hidden">
      <ResizablePanel
        :default-size="30"
        :min-size="30"
        :max-size="45"
        class="hidden md:flex flex-col border-r bg-muted/10 min-w-96 min-h-0"
      >
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
            v-if="chatsLoading && chatSessions.length === 0"
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
              :class="{ 'bg-accent shadow-sm': chat.id === chatId }"
              @click="$router.push(`/chats/${chat.id}`)"
            >
              <div
                v-if="chat.id === chatId"
                class="absolute left-0 top-0 bottom-0 w-1 bg-primary"
              />

              <Avatar class="size-16 border shrink-0">
                <AvatarImage :src="chat.avatar_thumbnail_path ?? ''" />
                <AvatarFallback class="bg-primary/10 text-primary text-base">
                  {{ (chat.character_name || chat.title || '??').substring(0, 2).toUpperCase() }}
                </AvatarFallback>
              </Avatar>

              <div class="flex-1 min-w-0 flex flex-col gap-0.5">
                <div class="flex items-center justify-between w-full">
                  <span
                    class="font-semibold text-sm truncate pr-2"
                    :class="chat.id === chatId ? 'text-foreground' : 'text-foreground/80'"
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

            <div v-if="chatsHasMore" class="p-2 pt-0">
              <Button
                variant="ghost"
                size="sm"
                class="w-full text-xs text-muted-foreground hover:text-foreground h-8"
                :disabled="chatsLoading"
                @click="loadMoreChats"
              >
                <Loader2 v-if="chatsLoading" class="mr-2 h-3 w-3 animate-spin" />
                {{ chatsLoading ? 'Loading...' : 'Load older chats' }}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle class="hidden md:flex bg-border w-px" />

      <ResizablePanel :default-size="75" class="flex flex-col min-w-96 min-h-0 bg-background">
        <header
          class="flex items-center justify-between px-6 py-3 border-b shrink-0 h-16 bg-card/30 backdrop-blur"
        >
          <div class="flex items-center gap-3">
            <Sheet>
              <SheetTrigger as-child>
                <Button variant="ghost" size="icon" class="md:hidden -ml-2"
                  ><MessageSquare class="size-5"
                /></Button>
              </SheetTrigger>
              <SheetContent side="left"><p>Mobile Menu</p></SheetContent>
            </Sheet>

            <Avatar
              class="size-9 border shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
              @click="handleCharacterClick"
            >
              <AvatarImage :src="currentChat?.avatar_thumbnail_path ?? ''" />
              <AvatarFallback class="bg-primary/10 text-primary text-xs">
                {{ (currentChat?.character_name || currentChat?.title || 'CK').substring(0, 2).toUpperCase() }}
              </AvatarFallback>
            </Avatar>
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
            <Button variant="ghost" size="icon"><MoreVertical class="size-5" /></Button>
          </div>
        </header>

        <Sheet v-model:open="showCharacterInspector">
          <SheetContent
            side="right"
            class="w-[90vw] sm:max-w-135 p-0 overflow-hidden flex flex-col"
          >
            <SheetHeader class="sr-only">
              <SheetTitle>Character Details</SheetTitle>

              <SheetDescription>
                View character portrait and detailed information.
              </SheetDescription>
            </SheetHeader>

            <CharacterInspector
              v-if="currentChat"
              :character-id="currentChat.character_id"
              class="flex-1 min-h-0"
            />

            <div class="p-4 border-t bg-background shrink-0">
              <SheetClose as-child>
                <Button variant="outline" class="w-full">Close</Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>

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
                <Avatar class="size-8 shrink-0 border shadow-sm mt-0.5">
                  <AvatarFallback
                    :class="msg.role === 'assistant' ? 'bg-primary/10 text-primary' : 'bg-muted'"
                  >
                    <component :is="msg.role === 'assistant' ? Bot : User" class="size-4" />
                  </AvatarFallback>
                </Avatar>

                <div class="flex flex-col gap-1.5 max-w-[85%] lg:max-w-[75%]">
                  <div
                    class="flex items-center gap-2 px-1"
                    :class="{ 'flex-row-reverse': msg.role === 'user' }"
                  >
                    <span
                      class="text-[11px] font-bold text-muted-foreground uppercase tracking-tight"
                    >
                      {{ msg.role === 'assistant' ? 'Assistant' : 'You' }}
                    </span>
                    <span class="text-[10px] text-muted-foreground/40 font-medium">
                      {{ new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                    </span>
                  </div>

                  <div
                    class="p-3.5 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap shadow-sm border transition-shadow group-hover:shadow-md"
                    :class="msg.role === 'user'
                      ? 'bg-primary text-primary-foreground border-primary rounded-tr-none'
                      : 'bg-card border-border rounded-tl-none'"
                  >
                    {{ msg.content }}
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
      </ResizablePanel>
    </ResizablePanelGroup>
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
