<script setup lang="ts">
import { ref } from 'vue'
import {
  MoreHorizontal,
  Pin,
  Pencil,
  GitFork,
  Copy,
  Trash2,
  RefreshCw
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { components } from '@/api/schema'
import { useClipboard } from '@vueuse/core'
import { useToast } from '@/composables/useToast'

type Message = components['schemas']['MessageResponse']

const props = defineProps<{
  message: Message
  isLatest?: boolean
  isRegenerating?: boolean
}>()

const emit = defineEmits<{
  (e: 'regenerate'): void
}>()

const isMenuOpen = ref(false)
const { copy } = useClipboard()
const { success } = useToast()

const handleCopy = async () => {
  await copy(props.message.content)
  success(`Message ${props.message.id} copied`, 'The message content is now in your clipboard.')
}
</script>

<template>
  <div
    class="flex items-center gap-2 px-1 mt-0.5"
    :class="message.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
  >
    <span class="text-[10px] text-muted-foreground/40 font-medium">
      {{ new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
    </span>

    <Button
      v-if="isLatest && message.role === 'assistant' && !isRegenerating"
      variant="ghost"
      size="icon"
      class="size-5 text-muted-foreground hover:text-foreground"
      title="Regenerate"
      @click="$emit('regenerate')"
    >
      <RefreshCw class="size-3.5" />
    </Button>

    <DropdownMenu v-model:open="isMenuOpen">
      <DropdownMenuTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          :class="cn(
            'size-5 transition-opacity text-muted-foreground hover:text-foreground',
            isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )"
        >
          <MoreHorizontal class="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent :align="message.role === 'user' ? 'end' : 'start'" class="w-40">
        <DropdownMenuItem>
          <span>Pin</span>
          <Pin class="size-3.5 ml-auto opacity-60" />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>Edit</span>
          <Pencil class="size-3.5 ml-auto opacity-60" />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>Branch</span>
          <GitFork class="size-3.5 ml-auto opacity-60" />
        </DropdownMenuItem>
        <DropdownMenuItem @click="handleCopy">
          <span>Copy</span>
          <Copy class="size-3.5 ml-auto opacity-60" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem class="text-destructive focus:text-destructive">
          <span>Delete</span>
          <Trash2 class="size-3.5 ml-auto opacity-60" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
