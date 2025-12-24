<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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

// UI Components
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

// Get chatId from route
const router = useRouter()
const route = useRoute()
const chatId = computed(() => route.params.chatId as string || null)

// Use the new composables
const {
  chatSessions,
  loading: chatsLoading,
  hasMore: chatsHasMore,
  loadMore: loadMoreChats,
} = useChatSessions({ pageSize: 20 })

// Auto-select first chat if none selected and chats are loaded
watch(chatSessions, (newChats) => {
  if (!chatId.value && newChats.length > 0) {
    router.replace(`/chats/${newChats[0].id}`)
  }
}, { immediate: true })

const { messages, loading, hasMore, loadMore } = useChatMessages(() => chatId.value, {
  pageSize: 20,
  autoLoad: true
})

const inputValue = ref('')
const scrollAreaRef = ref<any>(null)
const scrollViewport = computed(() => scrollAreaRef.value?.viewportRef?.$el || null)

// Scroll to bottom when messages are initially loaded
watch(messages, async (newMessages, oldMessages) => {
  // Only scroll to bottom on INITIAL load (from 0 to N messages)
  if (oldMessages.length === 0 && newMessages.length > 0) {
    await nextTick()
    if (scrollViewport.value) {
      scrollViewport.value.scrollTop = scrollViewport.value.scrollHeight
    }
  }
})

const handleLoadMore = async () => {
  if (!scrollViewport.value) return

  const container = scrollViewport.value
  const previousScrollHeight = container.scrollHeight
  const previousScrollTop = container.scrollTop

  await loadMore()

  await nextTick()

  // Maintain scroll position when prepending messages
  const newScrollHeight = container.scrollHeight
  const heightDifference = newScrollHeight - previousScrollHeight
  container.scrollTop = previousScrollTop + heightDifference
}
</script>

<template>
  <div class="h-full w-full bg-background overflow-hidden flex flex-col">
    <ResizablePanelGroup direction="horizontal" class="flex-1 items-stretch overflow-hidden">
      <!-- SIDEBAR: CHAT SESSIONS -->
      <ResizablePanel
        :default-size="25"
        :min-size="20"
        :max-size="40"
        class="hidden md:flex flex-col border-r bg-muted/10 min-w-64 min-h-0"
      >
        <div class="p-4 flex items-center justify-between shrink-0 h-16 border-b bg-background/50 backdrop-blur">
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

        <ScrollArea class="flex-1 min-h-0" type="always">
          <div v-if="chatsLoading && chatSessions.length === 0" class="flex flex-col items-center justify-center p-8 text-center">
            <Loader2 class="size-6 animate-spin text-muted-foreground mb-2" />
            <p class="text-xs text-muted-foreground">Loading chats...</p>
          </div>

          <div v-else class="flex flex-col gap-1 p-2">
            <button
              v-for="chat in chatSessions"
              :key="chat.id"
              class="flex flex-col items-start gap-1 p-3 rounded-lg text-left transition-colors hover:bg-accent group relative overflow-hidden shrink-0"
              :class="{ 'bg-accent shadow-sm': chat.id === chatId }"
              @click="$router.push(`/chats/${chat.id}`)"
            >
              <!-- Active Indicator -->
              <div v-if="chat.id === chatId" class="absolute left-0 top-0 bottom-0 w-1 bg-primary" />

              <div class="flex items-center justify-between w-full">
                <span 
                  class="font-semibold text-sm truncate pr-8"
                  :class="chat.id === chatId ? 'text-foreground' : 'text-foreground/80'"
                >{{ chat.title }}</span>
                <span class="text-[10px] opacity-70 shrink-0">
                  {{ new Date(chat.updated_at).toLocaleDateString() }}
                </span>
              </div>
              <div class="flex flex-col gap-0.5 w-full">
                <span v-if="chat.model_name" class="text-[10px] font-medium text-primary/80 uppercase tracking-wider">
                  {{ chat.model_name }}
                </span>
                <span class="text-xs line-clamp-2 opacity-60 leading-snug">
                  {{ chat.preview || 'No messages yet...' }}
                </span>
              </div>
            </button>

            <!-- Load More Chats -->
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

      <!-- MAIN AREA: MESSAGES -->
      <ResizablePanel :default-size="75" class="flex flex-col min-w-96 min-h-0 bg-background">
        <!-- Message Header -->
        <header class="flex items-center justify-between px-6 py-3 border-b shrink-0 h-16 bg-card/30 backdrop-blur">
          <div class="flex items-center gap-3">
            <!-- Mobile Menu Trigger -->
            <Sheet>
              <SheetTrigger as-child>
                <Button variant="ghost" size="icon" class="md:hidden -ml-2">
                  <MessageSquare class="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" class="w-80 sm:w-96 flex flex-col p-0">
                <div class="p-4 border-b">
                  <h2 class="font-bold text-lg">Chats</h2>
                </div>
                <div class="p-4 py-2">
                  <div class="relative">
                    <Search class="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input placeholder="Search chats..." class="pl-9" />
                  </div>
                </div>
                <ScrollArea class="flex-1" type="always">
                  <div class="flex flex-col gap-1 p-2">
                    <button
                      v-for="chat in chatSessions"
                      :key="chat.id"
                      class="flex flex-col items-start gap-1 p-3 rounded-lg text-left transition-colors hover:bg-accent group relative overflow-hidden shrink-0"
                      :class="{ 'bg-accent shadow-sm': chat.id === chatId }"
                      @click="$router.push(`/chats/${chat.id}`)"
                    >
                      <div v-if="chat.id === chatId" class="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                      <div class="flex items-center justify-between w-full">
                        <span class="font-semibold text-sm truncate pr-8">{{ chat.title }}</span>
                        <span class="text-[10px] opacity-70 shrink-0">
                          {{ new Date(chat.updated_at).toLocaleDateString() }}
                        </span>
                      </div>
                      <span class="text-xs line-clamp-1 opacity-60">{{ chat.preview || 'No messages yet...' }}</span>
                    </button>
                    <div v-if="chatsHasMore" class="p-2">
                      <Button variant="ghost" size="sm" class="w-full text-xs" :disabled="chatsLoading" @click="loadMoreChats">
                        Load more
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <Avatar class="size-9 border shadow-sm">
              <AvatarImage src="/placeholder.jpg" />
              <AvatarFallback class="bg-primary/10 text-primary">CK</AvatarFallback>
            </Avatar>
            <div class="flex flex-col">
              <h2 class="text-sm font-semibold leading-none mb-1">Keeper of Candlekeep</h2>
              <p class="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <span class="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Active Session
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <Button variant="ghost" size="icon"><MoreVertical class="size-5" /></Button>
          </div>
        </header>

        <!-- Message List -->
        <ScrollArea ref="scrollAreaRef" class="flex-1 min-h-0" type="always">
          <div class="flex flex-col max-w-3xl mx-auto w-full p-4 sm:p-6 lg:p-8">
            <!-- Load More Messages -->
            <div v-if="hasMore && !loading" class="flex justify-center mb-8">
              <Button @click="handleLoadMore" variant="outline" size="sm" class="rounded-full px-6 text-xs h-8">
                Load older messages
              </Button>
            </div>

            <!-- Loading older indicator -->
            <div v-if="loading && messages.length > 0" class="flex justify-center mb-8">
              <Loader2 class="size-5 animate-spin text-muted-foreground/50" />
            </div>

            <!-- Messages -->
            <div class="flex flex-col gap-8 pb-4">
              <div
                v-for="msg in messages"
                :key="msg.id"
                class="flex gap-4 group"
                :class="{ 'flex-row-reverse': msg.role === 'user' }"
              >
                <Avatar class="size-8 shrink-0 border shadow-sm mt-0.5">
                  <AvatarFallback :class="msg.role === 'assistant' ? 'bg-primary/10 text-primary' : 'bg-muted'">
                    <component :is="msg.role === 'assistant' ? Bot : User" class="size-4" />
                  </AvatarFallback>
                </Avatar>
                <div class="flex flex-col gap-1.5 max-w-[85%] lg:max-w-[75%]">
                  <div class="flex items-center gap-2 px-1" :class="{ 'flex-row-reverse': msg.role === 'user' }">
                    <span class="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
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

            <!-- Empty / Loading States -->
            <div v-if="loading && messages.length === 0" class="flex-1 flex flex-col items-center justify-center py-20 text-center">
              <Loader2 class="size-8 animate-spin text-muted-foreground/30 mb-4" />
              <p class="text-sm text-muted-foreground/60">Retrieving conversation...</p>
            </div>

            <div v-if="!loading && messages.length === 0" class="flex-1 flex flex-col items-center justify-center py-20 text-center opacity-40">
              <MessageSquare class="size-12 mb-4" />
              <p class="text-sm font-medium">No messages in this chronicle yet.</p>
            </div>

            <div v-if="!hasMore && messages.length > 0" class="text-center py-12 text-[11px] text-muted-foreground/40 uppercase tracking-[0.2em] font-bold">
              End of Scroll
            </div>
          </div>
        </ScrollArea>

        <!-- Input Area -->
        <div v-if="chatId" class="p-4 border-t bg-background/50 backdrop-blur shrink-0">
          <div class="max-w-3xl mx-auto relative flex items-end gap-2 p-2 rounded-2xl border bg-card shadow-sm focus-within:ring-2 ring-primary/10 transition-all">
            <Button variant="ghost" size="icon" class="size-10 text-muted-foreground hover:text-foreground shrink-0 rounded-xl">
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
