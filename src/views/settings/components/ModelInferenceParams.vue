<script setup lang="ts">
import { ref, computed } from 'vue'
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Info, RefreshCw, Settings2, Sliders, Box } from 'lucide-vue-next'
import { useSettingsStore } from '@/stores/settings'
import { toast } from 'vue-sonner'
import type { components } from '@/api/schema'
import ParamInput from './ParamInput.vue'

type Model = components['schemas']['ModelDetailResponse']

const props = defineProps<{
  model: Model
}>()

const settingsStore = useSettingsStore()

// -- STATE --
const showResetParamsDialog = ref(false)

// -- HELPERS --
const isSmartToggleSchema = (schema: any) => {
  if (schema.type === 'boolean') return true
  if (schema.type === 'enum' && schema.str_values) {
    const values = schema.str_values.map((v: string) => v.toLowerCase())
    return values.includes('enabled') && values.includes('disabled') && values.length === 2
  }
  return false
}

// -- COMPUTED GROUPING --
const groupedParams = computed(() => {
  const params = props.model.model_family.parameters as Record<string, any>
  const groups = {
    compact: [] as string[], // Enums, Booleans, Simple Numbers
    sliders: [] as string[], // Numbers with Range
    complex: [] as string[], // Lists, Objects, Long Strings (System)
  }

  const keys = Object.keys(params || {})

  for (const key of keys) {
    const config = params[key]
    // Check for complex types OR the specific 'system' parameter which requires a Textarea
    if (config.type === 'object' || config.type === 'list' || key === 'system') {
      groups.complex.push(key)
    } else if (
      (config.type === 'int' || config.type === 'float') &&
      config.min_value !== undefined &&
      config.max_value !== undefined
    ) {
      groups.sliders.push(key)
    } else {
      // Boolean, Enum, String (short), Number without range
      groups.compact.push(key)
    }
  }

  // SORT COMPACT GROUP: Toggles (Booleans/Smart Enums) first, then others
  groups.compact.sort((a, b) => {
    const isToggleA = isSmartToggleSchema(params[a])
    const isToggleB = isSmartToggleSchema(params[b])

    if (isToggleA && !isToggleB) return -1
    if (!isToggleA && isToggleB) return 1
    return 0 // Keep relative order otherwise
  })

  return groups
})

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
  if (Array.isArray(val)) return `List [${val.length}]`
  if (typeof val === 'object' && val !== null) return 'Object'
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
    props.model.parameters = {}
    toast.success('Overrides cleared. Click Save to apply.')
  }
  showResetParamsDialog.value = false
}
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between pb-2">
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

    <CardContent class="space-y-8 pt-4">
      <div v-if="groupedParams.compact.length > 0" class="space-y-4">
        <div class="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Settings2 class="size-4" /> General
        </div>

        <div class="rounded-lg border bg-muted/20 divide-y divide-border/50">
          <div
            v-for="key in groupedParams.compact"
            :key="key"
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 hover:bg-muted/40 transition-colors"
          >
            <div class="flex flex-col gap-1 overflow-hidden pr-4">
              <div class="flex items-center gap-2">
                <div v-if="isOverridden(key)" class="size-1.5 rounded-full bg-blue-500 shrink-0" />

                <Label
                  class="text-sm font-medium truncate cursor-pointer"
                  :class="isOverridden(key) ? 'text-foreground' : 'text-muted-foreground'"
                >
                  {{ getParamLabel(key) }}
                </Label>

                <TooltipProvider v-if="getParamDoc(key)?.detailed_info">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <Info
                        class="size-3.5 text-muted-foreground/40 cursor-help hover:text-foreground shrink-0"
                      />
                    </TooltipTrigger>
                    <TooltipContent side="right" :side-offset="10" class="max-w-sm p-4">
                      <p class="text-sm leading-relaxed">{{ getParamDoc(key).detailed_info }}</p>
                      <div class="text-xs font-mono mt-2 pt-2 border-t border-background/20">
                        <span class="opacity-60">Default:</span>
                        <span class="ml-1 font-bold">{{ formatDefaultValue((model.model_family.parameters![key] as any).default) }}</span>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <p
                class="text-[0.8rem] text-muted-foreground/70 pl-3.5"
                v-if="getParamDoc(key)?.short_info"
              >
                {{ getParamDoc(key).short_info }}
              </p>
            </div>

            <div class="shrink-0">
              <ParamInput
                :schema="model.model_family.parameters![key]"
                :model-value="getEffectiveValue(key, model.model_family.parameters![key])"
                layout="horizontal"
                @update:model-value="(v) => updateParam(key, v)"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-if="groupedParams.sliders.length > 0" class="space-y-4">
        <div class="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Sliders class="size-4" /> Fine-Tuning
        </div>

        <div class="rounded-lg border bg-muted/20 divide-y divide-border/50">
          <div
            v-for="key in groupedParams.sliders"
            :key="key"
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 hover:bg-muted/40 transition-colors"
          >
            <div class="flex flex-col gap-1 overflow-hidden pr-4">
              <div class="flex items-center gap-2">
                <div v-if="isOverridden(key)" class="size-1.5 rounded-full bg-blue-500 shrink-0" />

                <Label
                  class="text-sm font-medium truncate cursor-pointer"
                  :class="isOverridden(key) ? 'text-foreground' : 'text-muted-foreground'"
                >
                  {{ getParamLabel(key) }}
                </Label>

                <TooltipProvider v-if="getParamDoc(key)?.detailed_info">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <Info
                        class="size-3.5 text-muted-foreground/40 cursor-help hover:text-foreground shrink-0"
                      />
                    </TooltipTrigger>
                    <TooltipContent side="right" :side-offset="10" class="max-w-sm p-4">
                      <p class="text-sm leading-relaxed">{{ getParamDoc(key).detailed_info }}</p>
                      <div class="text-xs font-mono mt-2 pt-2 border-t border-background/20">
                        <span class="opacity-60">Default:</span>
                        <span class="ml-1 font-bold">{{ formatDefaultValue((model.model_family.parameters![key] as any).default) }}</span>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <p
                class="text-[0.8rem] text-muted-foreground/70 pl-3.5"
                v-if="getParamDoc(key)?.short_info"
              >
                {{ getParamDoc(key).short_info }}
              </p>
            </div>

            <div class="shrink-0">
              <ParamInput
                :schema="model.model_family.parameters![key]"
                :model-value="getEffectiveValue(key, model.model_family.parameters![key])"
                layout="horizontal"
                @update:model-value="(v) => updateParam(key, v)"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-if="groupedParams.complex.length > 0" class="space-y-4">
        <div class="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Box class="size-4" /> Advanced
        </div>

        <div
          v-for="key in groupedParams.complex"
          :key="key"
          class="relative p-4 rounded-lg border bg-muted/20"
        >
          <div v-if="isOverridden(key)" class="absolute top-3 right-3 z-10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <div
                    class="size-2 rounded-full bg-blue-500 ring-4 ring-muted/20 cursor-help"
                  ></div>
                </TooltipTrigger>
                <TooltipContent>
                  <p class="text-xs font-semibold">Overridden</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div class="flex items-center gap-2 mb-3">
            <Label class="text-sm font-medium">
              {{ getParamLabel(key) }}
            </Label>
            <TooltipProvider v-if="getParamDoc(key)">
              <Tooltip>
                <TooltipTrigger as-child>
                  <Info class="size-3.5 text-muted-foreground/50 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" :side-offset="10" class="max-w-sm p-4">
                  <p class="text-sm leading-relaxed">{{ getParamDoc(key).detailed_info }}</p>
                  <div class="text-xs font-mono mt-2 pt-2 border-t border-background/20">
                    <span class="opacity-60">Default:</span>
                    <span class="ml-1 font-bold">{{ formatDefaultValue((model.model_family.parameters![key] as any).default) }}</span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <ParamInput
            :schema="model.model_family.parameters![key]"
            :model-value="getEffectiveValue(key, model.model_family.parameters![key])"
            layout="vertical"
            @update:model-value="(v) => updateParam(key, v)"
          />
        </div>
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
