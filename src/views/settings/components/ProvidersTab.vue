<script setup lang="ts">
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, Plus, Link } from 'lucide-vue-next'
import BrandIcon from '@/components/shared/BrandIcon.vue'

defineProps<{
  providers: any[]
}>()
</script>

<template>
  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
    <Card
      v-for="prov in providers"
      :key="prov.id"
      :class="prov.enabled ? 'border-primary/50 bg-primary/5' : ''"
    >
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <div class="flex items-center gap-3">
          <BrandIcon :name="prov.provider_type" class="size-5" />
          <CardTitle class="text-lg font-bold">{{ prov.name }}</CardTitle>
        </div>
        <Badge :variant="prov.enabled ? 'default' : 'outline'">
          {{ prov.enabled ? 'Active' : 'Disabled' }}
        </Badge>
      </CardHeader>

      <CardContent class="pt-4 flex flex-col gap-2">
        <div class="flex items-center space-x-2 text-sm text-muted-foreground">
          <component :is="prov.enabled ? CheckCircle2 : AlertCircle" class="size-4" />
          <span>{{ prov.api_key_configured ? 'Key Configured' : 'Missing API Key' }}</span>
        </div>
        <div
          v-if="prov.base_url"
          class="flex items-center space-x-2 text-xs text-muted-foreground/70 pl-0.5"
        >
          <Link class="size-3 shrink-0" />
          <span class="truncate font-mono" :title="prov.base_url">{{ prov.base_url }}</span>
        </div>
      </CardContent>

      <CardFooter class="mt-auto pt-4">
        <Button variant="outline" class="w-full">Configure</Button>
      </CardFooter>
    </Card>

    <Card
      class="flex flex-col items-center justify-center border-dashed border-2 hover:border-primary/50 cursor-pointer transition-colors h-full min-h-45"
    >
      <div class="flex flex-col items-center gap-2 text-muted-foreground">
        <Plus class="size-8" />
        <span class="font-medium">Add Provider</span>
      </div>
    </Card>
  </div>
</template>
