<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import AppPagination from '@/components/shared/AppPagination.vue'
import { Cpu, Plus, Edit, Search, Loader2, Globe } from 'lucide-vue-next'
import { client } from '@/api/client'
import { toast } from 'vue-sonner'

const props = defineProps<{
  providers: any[]
}>()

const router = useRouter()

// -- STATE --
const isLoading = ref(true)
const items = ref<any[]>([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const searchQuery = ref('')

const getProviderName = (providerId: string) => {
  const p = props.providers.find((p) => p.id === providerId)
  return p ? p.name : 'Unknown'
}

// -- ACTIONS --
const fetchData = async () => {
  isLoading.value = true
  try {
    const { data, error } = await client.GET('/api/models', {
      params: {
        query: {
          page: page.value,
          limit: limit.value,
          name: searchQuery.value || undefined,
        },
      },
    })

    if (error) throw error

    if (data.items) {
      items.value = data.items
      total.value = data.total_items ?? data.items.length
    } else {
      items.value = Array.isArray(data) ? data : []
      total.value = items.value.length
    }
  } catch (error) {
    console.error('Failed to load models:', error)
    toast.error('Failed to load models')
  } finally {
    isLoading.value = false
  }
}

const toggleFlags = async (model: any) => {
  try {
    const { error } = await client.PATCH('/api/models/{model_id}/flags', {
      params: { path: { model_id: model.id } },
      body: {
        enabled: model.enabled,
        use_openrouter: model.use_openrouter,
      },
    })
    if (error) throw error
    toast.success(`${model.name} flags updated`)
  } catch (error) {
    console.error('Failed to update flags:', error)
    toast.error('Failed to update flags')
    // Refresh to revert UI state
    fetchData()
  }
}

// Debounced search
const onSearch = useDebounceFn(() => {
  page.value = 1
  fetchData()
}, 300)

watch(searchQuery, onSearch)
watch(page, fetchData)

onMounted(fetchData)
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Model Registry</CardTitle>
        <CardDescription>Available models fetched from connected providers.</CardDescription>
      </div>
      <div class="flex items-center gap-2">
        <div class="relative w-64">
          <Search class="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input v-model="searchQuery" placeholder="Search models..." class="pl-8" />
        </div>
        <Button size="sm"><Plus class="size-4 mr-2" /> Add Custom Model</Button>
      </div>
    </CardHeader>
    <CardContent>
      <!-- Top Pagination -->
      <div class="flex justify-end mb-4" v-if="total > limit">
        <AppPagination v-model:page="page" :total="total" :limit="limit" />
      </div>

      <div v-if="isLoading" class="flex justify-center py-12">
        <Loader2 class="size-8 animate-spin text-muted-foreground" />
      </div>

      <div v-else-if="items.length === 0" class="text-center py-12 text-muted-foreground">
        No models found.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="model in items"
          :key="model.id"
          class="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div class="p-2 bg-primary/10 rounded-full">
              <Cpu class="size-5 text-primary" />
            </div>
            <div>
              <h4 class="font-semibold">{{ model.name }}</h4>
              <div class="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" class="text-[10px]">
                  {{ getProviderName(model.provider_id) }}
                </Badge>
                <span class="font-mono text-[10px] opacity-70">{{ model.model_identifier }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-6">
            <div class="flex items-center gap-4 border-r pr-6">
              <div class="flex items-center space-x-2">
                <Switch
                  :id="`enabled-${model.id}`"
                  :checked="model.enabled"
                  @update:checked="
                    (v: boolean) => {
                      model.enabled = v
                      toggleFlags(model)
                    }
                  "
                />
                <Label :for="`enabled-${model.id}`" class="text-xs text-muted-foreground"
                  >Enabled</Label
                >
              </div>

              <div class="flex items-center space-x-2">
                <Switch
                  :id="`openrouter-${model.id}`"
                  :checked="model.use_openrouter"
                  @update:checked="
                    (v: boolean) => {
                      model.use_openrouter = v
                      toggleFlags(model)
                    }
                  "
                />
                <Label
                  :for="`openrouter-${model.id}`"
                  class="text-xs text-muted-foreground flex items-center gap-1"
                >
                  <Globe class="size-3" />
                  OpenRouter
                </Label>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              @click="router.push(`/settings/models/${model.id}`)"
            >
              <Edit class="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Bottom Pagination -->
      <div class="flex justify-end mt-4" v-if="total > limit">
        <AppPagination v-model:page="page" :total="total" :limit="limit" />
      </div>
    </CardContent>
  </Card>
</template>
