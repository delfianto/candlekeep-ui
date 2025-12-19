<script setup lang="ts">
import { useRouter } from 'vue-router'
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
import { Cpu, Plus, Edit } from 'lucide-vue-next'

const props = defineProps<{
  models: any[]
  providers: any[]
}>()

const router = useRouter()

const getProviderName = (providerId: string) => {
  const p = props.providers.find((p) => p.id === providerId)
  return p ? p.name : 'Unknown'
}
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Model Registry</CardTitle>
        <CardDescription>Available models fetched from connected providers.</CardDescription>
      </div>
      <Button size="sm"><Plus class="size-4 mr-2" /> Add Custom Model</Button>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div
          v-for="model in models"
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

          <div class="flex items-center gap-4">
            <div class="flex items-center space-x-2">
              <Switch :id="`model-${model.id}`" v-model="model.enabled" />
              <Label :for="`model-${model.id}`" class="text-xs text-muted-foreground"
                >Enabled</Label
              >
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
    </CardContent>
  </Card>
</template>
