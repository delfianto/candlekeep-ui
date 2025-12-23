<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ContentLayout from '@/components/layout/ContentLayout.vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  AlertCircle,
  ArrowLeft,
  Cpu,
  Globe,
  Loader2,
  RotateCcw,
  Save,
  Trash2,
  Info,
  RefreshCw,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { client } from '@/api/client'
import type { components } from '@/api/schema'
import { toast } from 'vue-sonner'
import { useSettingsStore } from '@/stores/settings'

const route = useRoute()
const router = useRouter()
const settingsStore = useSettingsStore()
const modelId = route.params.id as string

type Model = components['schemas']['ModelDetailResponse']

// -- STATE --
const isLoading = ref(true)
const isSaving = ref(false)
const isDeleting = ref(false)
const model = ref<Model | null>(null)

// Dialog States
const showResetDialog = ref(false)
const showDeleteDialog = ref(false)
const showResetParamsDialog = ref(false)

// -- HELPERS --
const getParamDoc = (key: string) => settingsStore.parameterDocs[key]

const getParamLabel = (key: string) => {
  const doc = getParamDoc(key)
  if (doc?.label) return doc.label
  return key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const isOverridden = (key: string) => {
  if (!model.value || !model.value.parameters) return false
  return Object.prototype.hasOwnProperty.call(model.value.parameters, key)
}

const getEffectiveValue = (key: string, config: any) => {
  if (model.value && model.value.parameters && isOverridden(key)) {
    return model.value.parameters[key]
  }
  return config.default
}

const formatDefaultValue = (val: any) => {
  if (Array.isArray(val)) return val.join(', ')
  if (val === null || val === undefined) return 'None'
  return String(val)
}

// -- ACTIONS --

const fetchModel = async () => {
  isLoading.value = true
  try {
    const { data, error } = await client.GET('/api/models/{model_id}', {
      params: { path: { model_id: modelId } },
    })
    if (error) throw error
    // Ensure nested objects and optional fields are initialized for the UI
    model.value = {
      ...data,
      system_prompt: data.system_prompt ?? '',
      parameters: data.parameters ?? {},
    } as Model
  } catch (error) {
    console.error('Failed to load model', error)
    toast.error('Failed to load model details')
  } finally {
    isLoading.value = false
  }
}

const updateFlags = async () => {
  if (!model.value) return
  try {
    const { error } = await client.PATCH('/api/models/{model_id}/flags', {
      params: { path: { model_id: modelId } },
      body: {
        enabled: model.value.enabled,
        use_openrouter: model.value.use_openrouter,
      },
    })
    if (error) throw error
    toast.success('Model flags updated')
  } catch (error) {
    console.error('Failed to update model flags', error)
    toast.error('Failed to update model flags')
    // Refresh to revert UI state on error
    await fetchModel()
  }
}

const saveModel = async () => {
  if (!model.value) return
  isSaving.value = true
  try {
    const { error } = await client.PUT('/api/models/{model_id}', {
      params: { path: { model_id: modelId } },
      body: {
        name: model.value.name,
        system_prompt: model.value.system_prompt,
        parameters: model.value.parameters as Record<string, any>,
        provider_id: model.value.provider_id,
        model_identifier: model.value.model_identifier,
        model_family_id: model.value.model_family_id,
        use_openrouter: model.value.use_openrouter,
        openrouter_identifier: model.value.openrouter_identifier,
      },
    })
    if (error) throw error
    toast.success('Model settings saved')
  } catch (error) {
    console.error('Failed to save model', error)
    toast.error('Failed to save model settings')
  } finally {
    isSaving.value = false
  }
}

const handleResetConfirm = async () => {
  await fetchModel()
  showResetDialog.value = false
}

const handleResetParamsConfirm = async () => {
  if (model.value) {
    // Wipe local overrides
    model.value.parameters = {}
    toast.success('Overrides cleared. Click Save to apply.')
  }
  showResetParamsDialog.value = false
}

const handleDeleteConfirm = async () => {
  isDeleting.value = true
  try {
    const { error } = await client.DELETE('/api/models/{model_id}', {
      params: { path: { model_id: modelId } },
    })
    if (error) throw error
    toast.success('Model deleted')
    router.push({ path: '/settings', query: { tab: 'models' } })
  } catch (error) {
    console.error('Failed to delete model', error)
    toast.error('Failed to delete model')
  } finally {
    isDeleting.value = false
    showDeleteDialog.value = false
  }
}

// Handle generic parameter update
const updateParam = (key: string, value: any) => {
  if (model.value && model.value.parameters) {
    model.value.parameters[key] = value
  }
}

onMounted(async () => {
  await fetchModel()
  await settingsStore.fetchParameterDocs()
})
</script>

<template>
  <ContentLayout v-if="isLoading" variant="center">
    <Loader2 class="size-10 animate-spin text-muted-foreground" />
  </ContentLayout>

  <ContentLayout v-else-if="!model" variant="center">
    <div class="text-center space-y-4">
      <AlertCircle class="size-12 text-destructive mx-auto" />
      <h2 class="text-xl font-bold">Model Not Found</h2>
      <Button variant="outline" @click="router.push('/settings')">Return to Settings</Button>
    </div>
  </ContentLayout>

  <ContentLayout
    v-else
    variant="standard"
    :title="model.name"
    subtitle="Fine-tune inference parameters and behavior."
  >
    <template #header>
      <Button
        variant="ghost"
        size="sm"
        class="w-fit -ml-2 mb-2"
        @click="router.push({ path: '/settings', query: { tab: 'models' } })"
      >
        <ArrowLeft class="size-4 mr-2" /> Back to Settings
      </Button>
    </template>

    <div class="grid gap-6 xl:grid-cols-3">
      <div class="xl:col-span-2 space-y-6">
        <Card>
          <CardHeader class="flex flex-row items-center gap-4">
            <div class="p-3 bg-primary/10 rounded-full">
              <Cpu class="size-6 text-primary" />
            </div>
            <div class="space-y-1 flex-1">
              <CardTitle>{{ model.name }}</CardTitle>
              <div class="flex items-center gap-2">
                <Badge variant="outline">{{ model.model_identifier }}</Badge>
                <span
                  class="text-xs text-muted-foreground font-mono"
                  >{{ model.model_family.family_identifier }}</span
                >
              </div>
            </div>
            <Switch
              :checked="model.enabled"
              @update:checked="(v) => { if(model) { model.enabled = v; updateFlags() } }"
            />
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid gap-2">
              <Label>Display Name</Label>
              <Input v-model="model.name" />
            </div>

            <div class="flex items-center justify-between p-4 border rounded-lg bg-muted/40">
              <div class="space-y-0.5">
                <Label class="text-base flex items-center gap-2">
                  <Globe class="size-4" /> Use OpenRouter
                </Label>
                <p class="text-sm text-muted-foreground">
                  Route requests through OpenRouter instead of a direct provider call.
                </p>
              </div>
              <Switch
                :checked="model.use_openrouter"
                @update:checked="(v) => { if(model) { model.use_openrouter = v; updateFlags() } }"
              />
            </div>

            <div class="grid gap-2">
              <Label>System Prompt Override</Label>
              <Textarea
                v-model="(model.system_prompt as string)"
                class="min-h-30 font-mono text-sm"
                placeholder="Enter a default system prompt for this model..."
              />
              <p class="text-[0.8rem] text-muted-foreground">
                This prompt will be injected at the start of every context window unless overridden
                by a specific Chat or Persona.
              </p>
            </div>
          </CardContent>
        </Card>

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

              <div
                v-else-if="config.type === 'boolean'"
                class="flex items-center justify-between py-1"
              >
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

              <p
                class="text-[0.8rem] text-muted-foreground mt-2"
                v-if="getParamDoc(key)?.short_info"
              >
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
        </Card>
      </div>

      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle class="text-base">Metadata</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4 text-sm">
            <div class="grid gap-1 py-2 border-b">
              <span class="text-muted-foreground text-xs">Provider</span>
              <span class="font-medium">{{ model.provider_id.toUpperCase() }}</span>
            </div>

            <div class="grid gap-1 py-2 border-b">
              <span class="text-muted-foreground text-xs">Family</span>
              <span
                class="font-mono text-xs break-all"
                >{{ model.model_family.family_identifier }}</span
              >
            </div>

            <div class="grid gap-2 py-2 border-b">
              <Label class="text-muted-foreground text-xs">Native Model Name</Label>
              <Input v-model="model.model_identifier" class="h-8 font-mono text-xs" />
            </div>

            <div class="grid gap-2 py-2 border-b">
              <Label class="text-muted-foreground text-xs">OpenRouter Name</Label>
              <Input
                v-model="(model.openrouter_identifier as string)"
                class="h-8 font-mono text-xs"
                placeholder="Optional..."
              />
            </div>

            <div class="grid gap-1 py-2 border-b">
              <span class="text-muted-foreground text-xs">Created</span>
              <span class="font-medium">
                {{ new Date(model.created_at).toLocaleDateString() }}
              </span>
            </div>

            <div class="grid gap-1 py-2">
              <span class="text-muted-foreground text-xs">Updated</span>
              <span class="font-medium">
                {{ new Date(model.updated_at).toLocaleDateString() }}
              </span>
            </div>
          </CardContent>
          <CardFooter class="flex flex-col gap-3">
            <div class="flex w-full gap-2">
              <Button
                variant="outline"
                class="flex-1"
                @click="showResetDialog = true"
                :disabled="isSaving"
              >
                <RotateCcw class="size-4 mr-2" />
                Reset
              </Button>
              <Button class="flex-1" @click="saveModel" :disabled="isSaving">
                <Loader2 v-if="isSaving" class="size-4 mr-2 animate-spin" />
                <Save v-else class="size-4 mr-2" />
                Save
              </Button>
            </div>

            <Button
              variant="ghost"
              class="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              @click="showDeleteDialog = true"
            >
              <Trash2 class="size-4 mr-2" />
              Delete Model
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>

    <AlertDialog :open="showResetDialog" @update:open="showResetDialog = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard changes?</AlertDialogTitle>
          <AlertDialogDescription>
            This will revert all unsaved changes to their last saved state. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="handleResetConfirm">Confirm Reset</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

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

    <AlertDialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this model?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{{ model.name }}</strong> and remove it from your
            registry. Any chats using this model may break.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            @click="handleDeleteConfirm"
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <span v-if="isDeleting">Deleting...</span>
            <span v-else>Delete Permanently</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </ContentLayout>
</template>
