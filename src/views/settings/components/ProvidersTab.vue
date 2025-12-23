<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { KeyRound, Plus, Server } from 'lucide-vue-next'
import BrandIcon from '@/components/shared/BrandIcon.vue'

const router = useRouter()

defineProps<{
  providers: any[]
}>()
</script>

<template>
  <div class="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr w-full min-w-0">
    <Card
      v-for="prov in providers"
      :key="prov.id"
      class="min-w-0 overflow-hidden"
      :class="prov.enabled ? 'border-primary/50 bg-primary/5' : ''"
    >
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <div class="flex items-center gap-3 min-w-0">
          <BrandIcon :name="prov.provider_type" class="size-5 shrink-0" />
          <CardTitle
            class="text-lg font-bold truncate min-w-0"
            :title="prov.name"
            >{{ prov.name }}</CardTitle
          >
        </div>
        <Badge :variant="prov.enabled ? 'default' : 'outline'" class="shrink-0">
          {{ prov.enabled ? 'Active' : 'Disabled' }}
        </Badge>
      </CardHeader>

      <CardContent class="pt-4 flex flex-col gap-2">
        <div class="flex items-center space-x-2 text-sm text-muted-foreground">
          <KeyRound class="size-4 shrink-0" />
          <span>{{ prov.api_key_configured ? 'Key Configured' : 'Missing API Key' }}</span>
        </div>
        <div v-if="prov.base_url" class="flex items-center space-x-2 text-sm text-muted-foreground">
          <Server class="size-4 shrink-0" />
          <span class="truncate min-w-0" :title="prov.base_url">{{ prov.base_url }}</span>
        </div>
      </CardContent>

      <CardFooter class="mt-auto pt-4">
        <Button
          variant="outline"
          class="w-full"
          @click="router.push(`/settings/providers/${prov.id}`)"
          >Configure</Button
        >
      </CardFooter>
    </Card>

    <Card
      class="flex flex-col items-center justify-center border-dashed border-2 hover:border-primary/50 cursor-pointer transition-colors h-full min-h-45 min-w-0 overflow-hidden"
    >
      <div class="flex flex-col items-center gap-2 text-muted-foreground">
        <Plus class="size-8" />
        <span class="font-medium">Add Provider</span>
      </div>
    </Card>
  </div>
</template>
