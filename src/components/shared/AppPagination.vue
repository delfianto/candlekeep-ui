<script setup lang="ts">
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface Props {
  total: number
  limit: number
  siblingCount?: number
  showEdges?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  siblingCount: 1,
  showEdges: true,
})

const page = defineModel<number>('page', { required: true })
</script>

<template>
  <Pagination
    v-model:page="page"
    :total="props.total"
    :items-per-page="props.limit"
    :sibling-count="props.siblingCount"
    :show-edges="props.showEdges"
  >
    <PaginationContent v-slot="{ items }">
      <li class="flex items-center">
        <PaginationFirst />
      </li>
      <li class="flex items-center">
        <PaginationPrevious />
      </li>

      <template v-for="(item, index) in items">
        <PaginationItem
          v-if="item.type === 'page'"
          :key="index"
          :value="item.value"
          :is-active="item.value === page"
        >
          {{ item.value }}
        </PaginationItem>
        <li v-else :key="item.type" class="flex items-center">
          <PaginationEllipsis :index="index" />
        </li>
      </template>

      <li class="flex items-center">
        <PaginationNext />
      </li>
      <li class="flex items-center">
        <PaginationLast />
      </li>
    </PaginationContent>
  </Pagination>
</template>
