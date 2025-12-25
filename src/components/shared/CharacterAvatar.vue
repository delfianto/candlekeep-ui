<script setup lang="ts">
import { Avatar, AvatarFallback, CachedAvatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

defineProps<{
  src?: string | null
  username?: string | null
  fallbackClass?: string
}>()
</script>

<template>
  <Avatar class="shrink-0 border shadow-sm">
    <CachedAvatar :src="src ?? ''" />
    <AvatarFallback
      :class="cn('bg-primary/10 text-primary font-medium flex items-center justify-center', fallbackClass)"
    >
      <slot>
        {{ (username || 'CK').substring(0, 2).toUpperCase() }}
      </slot>
    </AvatarFallback>
  </Avatar>
</template>
