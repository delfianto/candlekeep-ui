<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import AppPagination from '@/components/shared/AppPagination.vue'
import { Box, Plus, Edit, Search, Loader2 } from 'lucide-vue-next'
import { client } from '@/api/client'

const router = useRouter()

// -- STATE --
// Force HMR update
const isLoading = ref(true)
const items = ref<any[]>([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const searchQuery = ref('')

// -- ACTIONS --
const fetchData = async () => {
  isLoading.value = true
  try {
    const { data, error } = await client.GET('/api/model-families', {
      params: {
        query: {
          page: page.value,
          limit: limit.value,
          name: searchQuery.value || undefined,
        },
      },
    })

    if (error) throw error

    if (data) {
      // Handle both paginated and non-paginated responses for safety
      if ('items' in data) {
        items.value = data.items
        total.value = data.meta?.total || data.items.length
      } else {
        items.value = Array.isArray(data) ? data : []
        total.value = items.value.length
      }
    }
  } catch (error) {
    console.error('Failed to load model families:', error)
  } finally {
    isLoading.value = false
  }
}

// Debounced search
const onSearch = useDebounceFn(() => {
  page.value = 1 // Reset to page 1 on search
  fetchData()
}, 300)

watch(searchQuery, onSearch)
watch(page, fetchData)

onMounted(fetchData)
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Model Families</CardTitle>
      <CardDescription>Base configurations for groups of related models.</CardDescription>
      <CardAction>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div class="relative w-full sm:w-64">
            <Search class="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input v-model="searchQuery" placeholder="Search families..." class="pl-8" />
          </div>
          <Button size="sm"><Plus class="size-4 mr-2" /> Create Family</Button>
        </div>
      </CardAction>
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
        No model families found.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="family in items"
          :key="family.id"
          class="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
        >
          <div class="flex items-center gap-4 min-w-0">
            <div class="p-2 bg-primary/10 rounded-full shrink-0">
              <Box class="size-5 text-primary" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="font-semibold truncate">{{ family.name }}</h4>
              <div class="flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  class="font-mono text-[10px] opacity-70 truncate"
                  :title="family.family_identifier"
                  >{{ family.family_identifier }}</span
                >
              </div>
              <p v-if="family.description" class="text-xs text-muted-foreground mt-1 line-clamp-1">
                {{ family.description }}
              </p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
            <div class="flex flex-wrap gap-1" v-if="family.provider_types">
              <Badge
                v-for="pt in family.provider_types.slice(0, 3)"
                :key="pt"
                variant="secondary"
                class="text-[10px]"
              >
                {{ pt }}
              </Badge>
              <Badge
                v-if="family.provider_types.length > 3"
                variant="secondary"
                class="text-[10px]"
              >
                +{{ family.provider_types.length - 3 }}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              class="w-full sm:w-auto"
              @click="router.push(`/settings/model-families/${family.id}`)"
            >
              <Edit class="size-4 mr-2 sm:mr-0" />
              <span class="sm:hidden">Edit Family</span>
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
