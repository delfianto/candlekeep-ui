<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-8">
    <div class="text-center space-y-2">
      <h2 class="text-2xl font-bold tracking-tight">Welcome to Candlekeep</h2>
      <p class="text-muted-foreground">Select a conversation to start chatting.</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="p-6 border rounded-xl bg-card hover:bg-muted/50 transition-colors cursor-pointer">
        <h3 class="font-semibold mb-2">New Chat</h3>
        <p class="text-sm text-muted-foreground mb-4">Start a fresh conversation with a model.</p>
        <Button size="sm">Create</Button>
      </div>
      <div class="p-6 border rounded-xl bg-card hover:bg-muted/50 transition-colors cursor-pointer">
        <h3 class="font-semibold mb-2">Character Library</h3>
        <p class="text-sm text-muted-foreground mb-4">Browse and import character cards.</p>
        <Button variant="outline" size="sm">Browse</Button>
      </div>
    </div>
  </div>
</template>
