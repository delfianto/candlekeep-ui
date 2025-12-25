<script setup lang="ts">
import {
  MoreHorizontal,
  Pin,
  Pencil,
  GitFork,
  Copy,
  Trash2
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import type { components } from '@/api/schema'

type Message = components['schemas']['MessageResponse']

defineProps<{
  message: Message
}>()
</script>

<template>
  <div
    class="flex items-center gap-2 px-1 mt-0.5"
    :class="message.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
  >
    <span class="text-[10px] text-muted-foreground/40 font-medium">
      {{ new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
    </span>

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          class="size-5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
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
        <DropdownMenuItem>
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
