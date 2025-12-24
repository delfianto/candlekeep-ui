<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useChatMessages } from '@/composables/useChatMessages'
import { client } from '@/api/client'
import type { components } from '@/api/schema'
import {
  Search,
  Plus,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Send,
  Bot,
  User
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

type Chat = components["schemas"]["ChatResponse"];

// Get chatId from route
const router = useRouter()
const route = useRoute()
const chatId = computed(() => route.params.chatId as string || null)

// Fetch chats
const chatSessions = ref<Chat[]>([])
const chatsLoading = ref(true)

onMounted(async () => {
  try {
    const { data, error: apiError } = await client.GET('/api/chats')
    if (apiError) throw apiError

    if (data) {
      // Handle both array and paginated response
      chatSessions.value = Array.isArray(data) ? data : data.items
      
      // Auto-select first chat if none selected
      if (!chatId.value && chatSessions.value.length > 0) {
        router.replace(`/chats/${chatSessions.value[0].id}`)
      }
    }
  } catch (err) {
    console.error('Error loading chats:', err)
  } finally {
    chatsLoading.value = false
  }
})

// Use the new composable for messages
const { messages, loading, hasMore, loadMore, error } = useChatMessages(() => chatId.value, {
  pageSize: 20, // Reduced to match API default and typical chat limits
  autoLoad: true
})

const inputValue = ref('')
const scrollContainer = ref<HTMLDivElement | null>(null)

// Scroll to bottom when messages are initially loaded
watch(messages, async (newMessages, oldMessages) => {
  // If we went from empty to having messages, it's likely an initial load
  if (oldMessages.length === 0 && newMessages.length > 0 && scrollContainer.value) {
    await nextTick()
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }
})

const handleLoadMore = async () => {
  if (!scrollContainer.value) return
  
  const container = scrollContainer.value
  const previousScrollHeight = container.scrollHeight
  const previousScrollTop = container.scrollTop

  await loadMore()
  
  await nextTick()
  
  const newScrollHeight = container.scrollHeight
  const heightDifference = newScrollHeight - previousScrollHeight
  container.scrollTop = previousScrollTop + heightDifference
}
</script>

<template>
  <div class="h-full w-full bg-background overflow-hidden">
    <ResizablePanelGroup direction="horizontal" class="h-full items-stretch">
      <ResizablePanel
        :default-size="25"
        :min-size="20"
        :max-size="40"
        class="hidden md:flex flex-col border-r bg-muted/10 min-w-64"
      >
        <div
          class="p-4 flex items-center justify-between shrink-0 h-16 border-b bg-background/50 backdrop-blur"
        >
          <h2 class="font-bold text-lg tracking-tight">Chats</h2>
          <Button size="icon" variant="ghost">
            <Plus class="size-5" />
          </Button>
        </div>

        <div class="p-4 py-2">
          <div class="relative">
            <Search class="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input placeholder="Search chats..." class="pl-9 bg-background" />
          </div>
        </div>

        <ScrollArea class="flex-1">
          <div class="flex flex-col gap-1 p-2">
            <button
              v-for="chat in chatSessions"
              :key="chat.id"
              class="flex flex-col items-start gap-1 p-3 rounded-lg text-left transition-colors hover:bg-accent/50"
              :class="{ 'bg-accent/50': chat.id === chatId }"
              @click="$router.push(`/chats/${chat.id}`)"
            >
              <div class="flex items-center justify-between w-full">
                <span class="font-semibold text-sm truncate text-foreground">{{ chat.title }}</span>
                <span class="text-[10px] opacity-70">{{ new Date(chat.updated_at).toLocaleDateString() }}</span>
              </div>
              <div class="flex items-center gap-2 w-full">
                <span class="text-xs truncate w-full opacity-80">
                  <span class="font-medium text-primary">{{ chat.model_id }}:</span>
                  Loading...
                </span>
              </div>
            </button>
          </div>
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle class="hidden md:flex bg-border w-px" />

      <ResizablePanel :default-size="75" class="flex flex-col min-w-96">
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
              <SheetContent side="left" class="w-80 sm:w-96">
                <div class="flex flex-col h-full mt-4">
                  <h2 class="font-bold text-lg mb-4">Chats</h2>
                  <div class="relative mb-4">
                    <Search class="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input placeholder="Search chats..." class="pl-9" />
                  </div>
                  <ScrollArea class="flex-1 -mx-4 px-4">
                    <div class="flex flex-col gap-2">
                      <button
                        v-for="chat in chatSessions"
                        :key="chat.id"
                        class="text-left p-2 hover:bg-accent rounded text-sm"
                        @click="$router.push(`/chats/${chat.id}`)"
                      >
                        <div class="font-bold">{{ chat.title }}</div>
                        <div class="text-xs text-muted-foreground truncate">{{ new Date(chat.updated_at).toLocaleDateString() }}</div>
                      </button>
                    </div>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>

            <Avatar>
              <AvatarImage src="/placeholder.jpg" />
              <AvatarFallback class="bg-primary/10 text-primary">CK</AvatarFallback>
            </Avatar>
            <div>
              <h2 class="text-sm font-semibold">Keeper of Candlekeep</h2>
              <p class="text-xs text-muted-foreground flex items-center gap-1">
                <span class="block size-2 rounded-full bg-green-500"></span>
                Llama-3-70b
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <Button variant="ghost" size="icon"><MoreVertical class="size-5" /></Button>
          </div>
        </header>

        <div ref="scrollContainer" class="flex-1 p-4 sm:p-6 bg-background overflow-y-auto">
          <div class="flex flex-col gap-6 max-w-3xl mx-auto pb-4">
            <!-- Error message -->
            <div v-if="error" class="error text-center py-4 text-red-500">
              Error loading messages: {{ error.message }}
            </div>

            <!-- Load More button -->
            <div v-if="hasMore && !loading" class="load-more-container text-center py-4">
              <Button @click="handleLoadMore" variant="outline">
                Load More Messages
              </Button>
            </div>

            <!-- Loading indicator (when loading older) -->
            <div v-if="loading && messages.length > 0" class="loading-indicator text-center py-4">
              Loading older messages...
            </div>

            <!-- Messages list -->
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="flex gap-4"
              :class="{ 'flex-row-reverse': msg.role === 'user' }"
            >
              <Avatar class="size-8 shrink-0 border">
                <AvatarFallback :class="msg.role === 'assistant' ? 'bg-primary/10' : 'bg-muted'">
                  <component :is="msg.role === 'assistant' ? Bot : User" class="size-4" />
                </AvatarFallback>
              </Avatar>
              <div class="flex flex-col gap-1 max-w-[85%]">
                <div
                  class="flex items-baseline gap-2"
                  :class="{ 'flex-row-reverse': msg.role === 'user' }"
                >
                  <span
                    class="text-xs font-semibold text-muted-foreground"
                    >{{ msg.role === 'assistant' ? 'Assistant' : 'You' }}</span
                  >
                  <span class="text-[10px] text-muted-foreground/60">{{ new Date(msg.created_at).toLocaleTimeString() }}</span>
                </div>
                <div
                  class="p-3 rounded-lg text-sm leading-relaxed whitespace-pre-wrap shadow-sm"
                  :class="msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border'"
                >
                  {{ msg.content }}
                </div>
              </div>
            </div>

            <!-- Initial Loading indicator -->
            <div v-if="loading && messages.length === 0" class="loading-indicator text-center py-4">
              Loading messages...
            </div>
            
            <!-- End of messages (only show if no more and we have messages) -->
             <div v-if="!hasMore && messages.length > 0" class="end-of-messages text-center py-4 text-sm text-muted-foreground">
              No older messages
            </div>
          </div>
        </div>

        <div class="p-4 border-t bg-background shrink-0">
          <div
            class="max-w-3xl mx-auto relative flex items-end gap-2 p-2 rounded-xl border bg-card focus-within:ring-2 ring-primary/20 transition-all"
          >
            <Button
              variant="ghost"
              size="icon"
              class="size-10 text-muted-foreground hover:text-foreground shrink-0 rounded-lg"
            >
              <Paperclip class="size-5" />
            </Button>
            <Textarea
              v-model="inputValue"
              placeholder="Send a message..."
              class="min-h-5 max-h-48 border-0 focus-visible:ring-0 resize-none bg-transparent py-3 shadow-none"
            />
            <Button size="icon" class="size-10 shrink-0 rounded-lg">
              <Send class="size-5" />
            </Button>
          </div>
          <div class="text-center mt-2">
            <p class="text-[10px] text-muted-foreground">
              AI can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
</template>
