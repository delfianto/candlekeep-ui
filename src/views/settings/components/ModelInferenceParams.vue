<script setup lang="ts">
import { ref } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Info, RefreshCw } from 'lucide-vue-next'
import { useSettingsStore } from '@/stores/settings'
import { toast } from 'vue-sonner'
import type { components } from '@/api/schema'

type Model = components['schemas']['ModelDetailResponse']

const props = defineProps<{
  model: Model
}>()

const settingsStore = useSettingsStore()

// -- STATE --
const showResetParamsDialog = ref(false)

// -- HELPERS --
const getParamDoc = (key: string) => settingsStore.parameterDocs[key]

const getParamLabel = (key: string) => {
  const doc = getParamDoc(key)
  if (doc?.label) return doc.label
  return key.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const isOverridden = (key: string) => {
  if (!props.model || !props.model.parameters) return false
  return Object.prototype.hasOwnProperty.call(props.model.parameters, key)
}

const getEffectiveValue = (key: string, config: any) => {
  if (props.model && props.model.parameters && isOverridden(key)) {
    return props.model.parameters[key]
  }
  return config.default
}

const formatDefaultValue = (val: any) => {
  if (Array.isArray(val)) return val.join(', ')
  if (val === null || val === undefined) return 'None'
  return String(val)
}

// -- ACTIONS --
const updateParam = (key: string, value: any) => {
  if (props.model && props.model.parameters) {
    props.model.parameters[key] = value
  }
}

const handleResetParamsConfirm = async () => {
  if (props.model) {
    // Wipe local overrides
    props.model.parameters = {}
    toast.success('Overrides cleared. Click Save to apply.')
  }
  showResetParamsDialog.value = false
}
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Inference Parameters</CardTitle>
        <CardDescription>
          Customize behavior. Values set here override the model family defaults.
        </CardDescription>
      </div>
      <Button
        v-if="Object.keys(model.parameters || {}).length > 0"
        variant="outline"
        size="sm"
        class="text-muted-foreground hover:text-destructive hover:border-destructive"
        @click="showResetParamsDialog = true"
      >
        <RefreshCw class="size-3 mr-2" />
        Reset Defaults
      </Button>
    </CardHeader>
    <CardContent class="space-y-4">
      <div
        v-for="(config, key) in (model.model_family.parameters as Record<string, any>)"
        :key="key"
        class="relative p-4 rounded-lg border bg-muted/40 transition-colors"
      >
        <div v-if="isOverridden(key)" class="absolute top-3 right-3 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <div
                  class="size-2 rounded-full bg-blue-500 ring-2 ring-background cursor-help"
                ></div>
              </TooltipTrigger>
              <TooltipContent>
                <p class="text-xs font-semibold mb-1">Custom Override Active</p>
                <p class="text-[10px] text-muted-foreground font-mono">
                  Family Default: {{ formatDefaultValue(config.default) }}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div class="flex items-center justify-between mb-4">
          <Label class="flex items-center gap-2 text-sm font-medium">
            {{ getParamLabel(key) }}
            <TooltipProvider v-if="getParamDoc(key)">
              <Tooltip>
                <TooltipTrigger as-child>
                  <Info class="size-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p class="max-w-xs text-sm">{{ getParamDoc(key).detailed_info }}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
        </div>

        <div
          v-if="(config.type === 'int' || config.type === 'float') && config.min_value !== undefined && config.max_value !== undefined"
          class="flex items-center gap-4"
        >
          <Slider
            :model-value="[Number(getEffectiveValue(key, config))]"
            @update:model-value="(v) => updateParam(key, v[0])"
            :min="config.min_value"
            :max="config.max_value"
            :step="config.type === 'int' ? 1 : 0.01"
            class="flex-1"
          />
          <Input
            type="number"
            class="w-20 h-8 text-right font-mono bg-background"
            :model-value="getEffectiveValue(key, config)"
            @update:model-value="(v) => updateParam(key, Number(v))"
          />
        </div>

        <div v-else-if="config.type === 'int' || config.type === 'float'">
          <Input
            type="number"
            class="font-mono bg-background"
            :model-value="getEffectiveValue(key, config)"
            @update:model-value="(v) => updateParam(key, Number(v))"
          />
        </div>

        <div v-else-if="config.type === 'boolean'" class="flex items-center justify-between py-1">
          <span class="text-sm text-muted-foreground">Enabled</span>
          <Switch
            :checked="getEffectiveValue(key, config)"
            @update:checked="(v) => updateParam(key, v)"
          />
        </div>

        <div v-else-if="config.type === 'enum'">
          <Select
            :model-value="getEffectiveValue(key, config)"
            @update:model-value="(v) => updateParam(key, v)"
          >
            <SelectTrigger class="bg-background">
              <SelectValue :placeholder="`Select ${getParamLabel(key)}`" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="opt in config.str_values" :key="opt" :value="opt">
                {{ opt }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div v-else-if="config.type === 'list'">
          <Textarea
            :model-value="Array.isArray(getEffectiveValue(key, config)) ? (getEffectiveValue(key, config) as string[]).join(', ') : ''"
            @update:model-value="(v) => updateParam(key, (v as string).split(',').map(s => s.trim()).filter(s => s))"
            placeholder="Comma separated values..."
            class="font-mono text-sm bg-background"
          />
        </div>

        <div v-else>
          <Input
            type="text"
            class="bg-background"
            :model-value="getEffectiveValue(key, config)"
            @update:model-value="(v) => updateParam(key, v)"
          />
        </div>

        <p class="text-[0.8rem] text-muted-foreground mt-2" v-if="getParamDoc(key)?.short_info">
          {{ getParamDoc(key).short_info }}
        </p>
      </div>

      <div
        v-if="Object.keys(model.model_family.parameters || {}).length === 0"
        class="text-center text-muted-foreground py-4"
      >
        No configurable parameters for this model family.
      </div>
    </CardContent>

    <AlertDialog :open="showResetParamsDialog" @update:open="showResetParamsDialog = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Inference Parameters?</AlertDialogTitle>
          <AlertDialogDescription>
            This will clear all parameter overrides for this model. It will inherit all default
            values from the <strong>{{ model.model_family.name }}</strong> family configuration.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="handleResetParamsConfirm">Confirm Reset</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </Card>
</template>
