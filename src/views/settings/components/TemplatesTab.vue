<script setup lang="ts">
import { ref } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Mock Data
const templates = ref([
  { id: 1, name: 'Creative Writer', description: 'For storytelling and RPG elements.', preview: 'You are an expert storyteller...' },
  { id: 2, name: 'Code Assistant', description: 'Strict logic and clean code output.', preview: 'You are a senior software engineer...' },
  { id: 3, name: 'Dungeon Master', description: 'Game logic and world state management.', preview: 'You are the keeper of the rules...' },
])
</script>

<template>
  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <Card v-for="temp in templates" :key="temp.id" class="group relative overflow-hidden">
      <CardHeader>
        <CardTitle>{{ temp.name }}</CardTitle>
        <CardDescription>{{ temp.description }}</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="bg-muted p-3 rounded-md text-xs font-mono text-muted-foreground line-clamp-3">
          {{ temp.preview }}
        </div>
      </CardContent>
      <CardFooter class="flex justify-between">
        <Button variant="ghost" size="sm" class="text-xs">Edit</Button>
        <Button variant="ghost" size="sm" class="text-xs text-destructive hover:text-destructive"
          >Delete</Button
        >
      </CardFooter>
    </Card>
  </div>
</template>
