<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMediaQuery } from '@vueuse/core'
import { useChatSessions } from '@/composables/useChatSessions'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

import ChatSidebar from './components/ChatSidebar.vue'
import ChatThread from './components/ChatThread.vue'
import ChatDetailPane from './components/ChatDetailPane.vue'

const router = useRouter()
const route = useRoute()
const chatId = computed(() => route.params.chatId as string || null)
const isMobile = useMediaQuery('(max-width: 768px)')
const showRightPane = ref(false)
const paneMode = ref<'character' | 'settings'>('character')

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

const handleSelectChat = (id: string) => {
  router.push(`/chats/${id}`)
}

const handleOpenCharacterInspector = () => {
  if (!currentChat.value) return

  if (isMobile.value) {
    router.push({ name: 'character-detail', params: { id: currentChat.value.character_id } })
  } else {
    paneMode.value = 'character'
    showRightPane.value = true
  }
}

const handleOpenSettings = () => {
  paneMode.value = 'settings'
  showRightPane.value = true
}
</script>

<template>
  <div class="h-full w-full bg-background overflow-hidden flex flex-col">
    <ResizablePanelGroup direction="horizontal" class="flex-1 items-stretch overflow-hidden">
      <!-- Left Sidebar: Chat List -->
      <ResizablePanel
        :default-size="30"
        :min-size="30"
        :max-size="45"
        class="hidden md:flex flex-col border-r bg-muted/10 min-w-96 min-h-0"
      >
        <ChatSidebar
          :chat-sessions="chatSessions"
          :loading="chatsLoading"
          :has-more="chatsHasMore"
          :selected-chat-id="chatId"
          @load-more="loadMoreChats"
          @select-chat="handleSelectChat"
        />
      </ResizablePanel>

      <ResizableHandle class="hidden md:flex bg-border w-px" />

      <!-- Main Content: Chat Thread -->
      <ResizablePanel :default-size="70" class="flex flex-col min-w-96 min-h-0 bg-background">
        <ChatThread
          :chat-id="chatId"
          :current-chat="currentChat"
          @open-character-inspector="handleOpenCharacterInspector"
          @open-settings="handleOpenSettings"
        />
      </ResizablePanel>
    </ResizablePanelGroup>

    <!-- Right Pane: Sheet (Dynamic Content) -->
    <Sheet v-model:open="showRightPane">
      <SheetContent
        side="right"
        class="w-[90vw] sm:max-w-[540px] p-0 overflow-hidden flex flex-col"
      >
        <SheetHeader class="sr-only">
          <SheetTitle
            >{{ paneMode === 'character' ? 'Character Details' : 'Chat Settings' }}</SheetTitle
          >
          <SheetDescription>
            {{ paneMode === 'character' ? 'View character info' : 'Adjust chat settings' }}
          </SheetDescription>
        </SheetHeader>

        <ChatDetailPane
          v-if="currentChat"
          :character-id="currentChat.character_id"
          :mode="paneMode"
        />

        <div class="p-4 border-t bg-background shrink-0">
          <SheetClose as-child>
            <Button variant="outline" class="w-full">Close</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>
