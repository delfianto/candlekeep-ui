<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { client } from '@/api/client'
import type { components } from '@/api/schema'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, CachedAvatar, AvatarFallback } from '@/components/ui/avatar'
import CachedImage from '@/components/shared/CachedImage.vue'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, User } from 'lucide-vue-next'

const props = defineProps<{
  characterId: string
}>()

const character = ref<components['schemas']['CharacterResponse'] | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const fetchCharacter = async () => {
  loading.value = true
  error.value = null
  try {
    const { data, error: apiError } = await client.GET('/api/characters/{character_id}', {
      params: {
        path: {
          character_id: props.characterId
        }
      }
    })

    if (apiError) {
      error.value = 'Failed to load character details'
    } else if (data) {
      character.value = data
    }
  } catch (e) {
    error.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.characterId) {
    fetchCharacter()
  }
})

watch(() => props.characterId, (newId) => {
  if (newId) {
    fetchCharacter()
  }
})
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div v-if="loading" class="flex-1 flex items-center justify-center p-8">
      <Loader2 class="size-8 animate-spin text-muted-foreground" />
    </div>

    <div v-else-if="error" class="flex-1 flex items-center justify-center p-8 text-destructive">
      {{ error }}
    </div>

    <Tabs v-else defaultValue="portrait" class="flex-1 flex flex-col overflow-hidden">
      <div class="px-4 pt-2 shrink-0">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="portrait">Portrait</TabsTrigger>
          <TabsTrigger value="card">Character Card</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="portrait" class="flex-1 p-4 min-h-0 overflow-hidden mt-0">
        <div
          class="h-full w-full flex items-center justify-center bg-muted/10 rounded-lg border overflow-hidden relative"
        >
          <CachedImage
            v-if="character?.avatar_path"
            :src="character.avatar_path"
            :alt="character.name"
            class="w-full h-full object-contain"
          />
          <div v-else class="flex flex-col items-center gap-2 text-muted-foreground">
            <User class="size-16 opacity-20" />
            <p class="text-sm">No portrait available</p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="card" class="flex-1 min-h-0 overflow-hidden mt-0">
        <ScrollArea class="h-full">
          <div class="p-4 space-y-4">
            <div class="flex items-center gap-4">
              <Avatar class="size-16 border">
                <CachedAvatar :src="character?.avatar_thumbnail_path ?? ''" />
                <AvatarFallback
                  >{{ character?.name?.substring(0, 2).toUpperCase() }}</AvatarFallback
                >
              </Avatar>
              <div>
                <h2 class="text-xl font-bold tracking-tight">{{ character?.name }}</h2>
                <div class="flex flex-wrap gap-1 mt-1">
                  <Badge
                    variant="secondary"
                    v-for="tag in character?.tags"
                    :key="tag"
                    class="text-[10px]"
                  >
                    {{ tag }}
                  </Badge>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <Card>
                <CardHeader class="pb-2">
                  <CardTitle class="text-sm font-medium uppercase text-muted-foreground"
                    >Description</CardTitle
                  >
                </CardHeader>
                <CardContent>
                  <p class="text-sm leading-relaxed whitespace-pre-wrap">
                    {{ character?.description || 'No description provided.' }}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader class="pb-2">
                  <CardTitle class="text-sm font-medium uppercase text-muted-foreground"
                    >Personality</CardTitle
                  >
                </CardHeader>
                <CardContent>
                  <p class="text-sm leading-relaxed whitespace-pre-wrap">
                    {{ character?.personality || 'No personality defined.' }}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader class="pb-2">
                  <CardTitle class="text-sm font-medium uppercase text-muted-foreground"
                    >Scenario</CardTitle
                  >
                </CardHeader>
                <CardContent>
                  <p class="text-sm leading-relaxed whitespace-pre-wrap">
                    {{ character?.scenario || 'No scenario defined.' }}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader class="pb-2">
                  <CardTitle class="text-sm font-medium uppercase text-muted-foreground"
                    >First Message</CardTitle
                  >
                </CardHeader>
                <CardContent>
                  <p
                    class="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground italic"
                  >
                    "{{ character?.first_message }}"
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  </div>
</template>
