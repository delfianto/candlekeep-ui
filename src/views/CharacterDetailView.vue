<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import CharacterInspector from '@/components/shared/CharacterInspector.vue'

const route = useRoute()
const router = useRouter()
const characterId = computed(() => route.params.id as string)

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="h-full w-full bg-background flex flex-col">
    <header class="flex items-center gap-2 p-4 border-b shrink-0 h-16">
      <Button variant="ghost" size="icon" @click="goBack">
        <ArrowLeft class="size-5" />
      </Button>
      <h1 class="text-lg font-semibold">Character Details</h1>
    </header>
    <div class="flex-1 overflow-hidden">
      <CharacterInspector :characterId="characterId" />
    </div>
  </div>
</template>
