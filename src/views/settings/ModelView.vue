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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertCircle,
  ArrowLeft,
  Cpu,
  Globe,
  Loader2,
  RotateCcw,
  Save,
  Trash2,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { client } from '@/api/client'
import type { components } from '@/api/schema'
import { toast } from 'vue-sonner'
import { useSettingsStore } from '@/stores/settings'
import { computed } from 'vue'
import ModelInferenceParams from './components/ModelInferenceParams.vue'

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

// -- COMPUTED --
const filteredProviders = computed(() => {
  if (!model.value || !settingsStore.providers) return []
  const allowedTypes = (model.value.model_family as any).provider_types || []
  return settingsStore.providers.filter((p: any) => allowedTypes.includes(p.provider_type))
})

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

onMounted(async () => {
  await Promise.all([
    fetchModel(),
    settingsStore.fetchParameterDocs(),
    settingsStore.fetchProviders(),
  ])
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

  <ContentLayout v-else variant="standard">
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

    <div class="grid gap-4 lg:gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader class="flex flex-row flex-wrap items-center gap-4">
            <div class="p-3 bg-primary/10 rounded-full">
              <Cpu class="size-6 text-primary" />
            </div>
            <div class="space-y-1 flex-1 min-w-40">
              <CardTitle>{{ model.name }}</CardTitle>
              <div class="flex items-center gap-2">
                <Badge variant="outline">{{ model.model_identifier }}</Badge>
                <span class="text-xs text-muted-foreground font-mono">
                  {{ model.model_family.family_identifier }}
                </span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <Switch
                id="header-enabled"
                v-model="model.enabled"
                @update:model-value="updateFlags"
              />
              <Label for="header-enabled" class="text-xs text-muted-foreground cursor-pointer"
                >Enabled</Label
              >
            </div>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid gap-2">
              <Label>Display Name</Label>
              <Input v-model="model.name" />
            </div>

            <div
              class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg bg-muted/40"
            >
              <div class="space-y-0.5">
                <Label class="text-base flex items-center gap-2">
                  <Globe class="size-4" /> Use OpenRouter
                </Label>
                <p class="text-sm text-muted-foreground">
                  Route requests through OpenRouter instead of a direct provider call.
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <Switch
                  id="openrouter-enabled"
                  v-model="model.use_openrouter"
                  @update:model-value="updateFlags"
                />
              </div>
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

        <ModelInferenceParams :model="model" />
      </div>

      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
            <CardDescription>
              Core configuration and identifiers for this model instance.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="space-y-4">
              <div class="rounded-lg border bg-muted/20 divide-y divide-border/50">
                <div class="flex flex-col gap-2 p-4 hover:bg-muted/40 transition-colors">
                  <Label class="text-sm font-medium">Provider</Label>
                  <Select v-model="model.provider_id">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="prov in filteredProviders"
                        :key="prov.id"
                        :value="prov.id"
                      >
                        {{ prov.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="flex flex-col gap-2 p-4 hover:bg-muted/40 transition-colors">
                  <Label class="text-sm font-medium text-muted-foreground">Family</Label>
                  <span class="font-mono text-sm break-all">
                    {{ model.model_family.family_identifier }}
                  </span>
                </div>

                <div class="flex flex-col gap-2 p-4 hover:bg-muted/40 transition-colors">
                  <Label class="text-sm font-medium">Native Model Name</Label>
                  <Input v-model="model.model_identifier" class="font-mono" />
                </div>

                <div class="flex flex-col gap-2 p-4 hover:bg-muted/40 transition-colors">
                  <Label class="text-sm font-medium">OpenRouter Name</Label>
                  <Input
                    v-model="(model.openrouter_identifier as string)"
                    class="font-mono"
                    placeholder="Optional..."
                  />
                </div>

                <div class="flex flex-col gap-2 p-4 hover:bg-muted/40 transition-colors">
                  <span class="text-sm font-medium text-muted-foreground">Created</span>
                  <span class="text-sm">
                    {{ new Date(model.created_at).toLocaleDateString() }}
                  </span>
                </div>

                <div class="flex flex-col gap-2 p-4 hover:bg-muted/40 transition-colors">
                  <span class="text-sm font-medium text-muted-foreground">Updated</span>
                  <span class="text-sm">
                    {{ new Date(model.updated_at).toLocaleDateString() }}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter class="flex flex-col gap-3">
            <div class="flex flex-col sm:flex-row w-full gap-2">
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
