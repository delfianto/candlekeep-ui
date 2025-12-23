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
import { Badge } from '@/components/ui/badge'
import { Box, Plus, Edit } from 'lucide-vue-next'

const props = defineProps<{
  modelFamilies: any[]
}>()

const router = useRouter()
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Model Families</CardTitle>
        <CardDescription>Base configurations for groups of related models.</CardDescription>
      </div>
      <Button size="sm"><Plus class="size-4 mr-2" /> Create Family</Button>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div
          v-for="family in modelFamilies"
          :key="family.id"
          class="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div class="p-2 bg-primary/10 rounded-full">
              <Box class="size-5 text-primary" />
            </div>
            <div>
              <h4 class="font-semibold">{{ family.name }}</h4>
              <div class="flex items-center gap-2 text-xs text-muted-foreground">
                <span class="font-mono text-[10px] opacity-70">{{ family.family_identifier }}</span>
              </div>
              <p v-if="family.description" class="text-xs text-muted-foreground mt-1 line-clamp-1">
                {{ family.description }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4">
             <div class="flex gap-1" v-if="family.provider_types">
                <Badge 
                    v-for="pt in family.provider_types.slice(0, 3)" 
                    :key="pt" 
                    variant="secondary" 
                    class="text-[10px]"
                >
                    {{ pt }}
                </Badge>
                <Badge v-if="family.provider_types.length > 3" variant="secondary" class="text-[10px]">
                    +{{ family.provider_types.length - 3 }}
                </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              @click="router.push(`/settings/model-families/${family.id}`)"
            >
              <Edit class="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
