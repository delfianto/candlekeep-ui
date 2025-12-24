<script setup lang="ts">
import CharacterInspector from '@/components/shared/CharacterInspector.vue'

defineProps<{
  characterId: string
}>()
</script>

<template>
  <div class="flex-1 min-h-0 flex flex-col overflow-hidden">
    <CharacterInspector :character-id="characterId" class="flex-1 min-h-0" />

    <!-- Placeholder for future settings -->
    <!-- <div v-if="mode === 'settings'">Chat Settings...</div> -->
  </div>
</template>
