<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import AppPagination from '@/components/shared/AppPagination.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Cpu, Plus, Edit, Search, Loader2 } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { client } from '@/api/client'
import { toast } from 'vue-sonner'

// -- TYPES --
interface Model {
  id: string
  name: string
  provider_id: string
  model_identifier: string
  enabled: boolean
  use_openrouter: boolean
}

const props = defineProps<{
  providers: any[]
}>()

const router = useRouter()

// -- STATE --
const isLoading = ref(true)
const items = ref<Model[]>([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const searchQuery = ref('')

// -- COMPUTED --
const providerMap = computed(() => {
  const map: Record<string, string> = {}
  props.providers.forEach((p) => {
    map[p.id] = p.name
  })
  return map
})

const getProviderName = (providerId: string) => {
  return providerMap.value[providerId] || 'Unknown'
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

    if (data && 'items' in data) {
      items.value = (data.items as Model[]) || []
      // Cast to any to access meta if the type definition isn't updated in the IDE context yet
      const meta = (data as any).meta
      total.value = meta?.total ?? items.value.length
    } else if (Array.isArray(data)) {
      items.value = data as Model[]
      total.value = items.value.length
    } else {
      items.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('Failed to load models:', error)
    toast.error('Failed to load models')
    items.value = []
  } finally {
    isLoading.value = false
  }
}

const toggleFlags = async (model: Model, newValue: boolean, field: 'enabled' | 'use_openrouter') => {
  const originalValue = model[field]
  model[field] = newValue

  try {
    const { error } = await client.PATCH('/api/models/{model_id}/flags', {
      params: { path: { model_id: model.id } },
      body: {
        enabled: model.enabled,
        use_openrouter: model.use_openrouter,
        [field]: newValue
      },
    })

    if (error) throw error
    toast.success(`${model.name} updated`)
  } catch (error) {
    console.error('Failed to update flags:', error)
    toast.error('Failed to update flags')
    // Revert on error
    model[field] = originalValue
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
    <CardHeader class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <CardTitle>Model Registry</CardTitle>
        <CardDescription>Available models fetched from connected providers.</CardDescription>
      </div>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
        <div class="relative w-full sm:w-64">
          <Search class="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input v-model="searchQuery" placeholder="Search models..." class="pl-8" />
        </div>
        <Button size="sm" @click="router.push('/settings/models/new')">
          <Plus class="size-4 mr-2" />
          Add Custom Model
        </Button>
      </div>
    </CardHeader>
    <CardContent>
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
          class="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
        >
          <div class="flex items-center gap-4 min-w-0">
            <div class="p-2 bg-primary/10 rounded-full shrink-0">
              <Cpu class="size-5 text-primary" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="font-semibold truncate">{{ model.name }}</h4>
              <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                <Badge variant="secondary" class="text-[10px] shrink-0">
                  {{ getProviderName(model.provider_id) }}
                </Badge>
                <span
                  class="font-mono text-[10px] opacity-70 truncate"
                  :title="model.model_identifier"
                  >{{ model.model_identifier }}</span
                >
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b sm:border-b-0 sm:border-r pb-4 sm:pb-0 pr-0 sm:pr-6 mr-0 sm:mr-2 w-full sm:w-auto"
            >
              <div class="flex items-center space-x-2">
                <Switch
                  :id="`enabled-${model.id}`"
                  :model-value="model.enabled"
                  @update:model-value="(val) => toggleFlags(model, val, 'enabled')"
                />
                <Label
                  :for="`enabled-${model.id}`"
                  class="text-xs text-muted-foreground cursor-pointer"
                  >Enabled</Label
                >
              </div>

              <div class="flex items-center space-x-2">
                <Switch
                  :id="`openrouter-${model.id}`"
                  :model-value="model.use_openrouter"
                  @update:model-value="(val) => toggleFlags(model, val, 'use_openrouter')"
                />
                <Label
                  :for="`openrouter-${model.id}`"
                  class="text-xs text-muted-foreground flex items-center gap-1 cursor-pointer"
                >
                  OpenRouter
                </Label>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              class="w-full sm:w-auto"
              @click="router.push(`/settings/models/${model.id}`)"
            >
              <Edit class="size-4 mr-2 sm:mr-0" />
              <span class="sm:hidden">Edit Model</span>
            </Button>
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-4" v-if="total > limit">
        <AppPagination v-model:page="page" :total="total" :limit="limit" />
      </div>
    </CardContent>
  </Card>
</template>
