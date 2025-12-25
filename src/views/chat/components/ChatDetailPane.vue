<script setup lang="ts">
import CharacterInspector from '@/components/shared/CharacterInspector.vue'
import UnderConstruction from '@/components/shared/UnderConstruction.vue'

defineProps<{
  characterId: string
  mode: 'character' | 'settings'
}>()
</script>

<template>
  <div class="flex-1 min-h-0 flex flex-col overflow-hidden">
    <template v-if="mode === 'character'">
      <CharacterInspector :character-id="characterId" class="flex-1 min-h-0" />
    </template>

    <template v-else-if="mode === 'settings'">
      <UnderConstruction
        title="Settings"
        message="The archivists are currently organizing the scrolls. Configuration options will be available here soon."
      />
    </template>
  </div>
</template>
