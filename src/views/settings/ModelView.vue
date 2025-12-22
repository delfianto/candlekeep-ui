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
import { Slider } from '@/components/ui/slider'
import {
  AlertCircle,
  ArrowLeft,
  Box,
  Cpu,
  Loader2,
  RotateCcw,
  Save,
  Thermometer,
  Trash2,
  Zap,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'

const route = useRoute()
const router = useRouter()
const modelId = route.params.id as string

// -- STATE --
const isLoading = ref(true)
const isSaving = ref(false)
const isDeleting = ref(false)
const model = ref<any>(null)

// Dialog States
const showResetDialog = ref(false)
const showDeleteDialog = ref(false)

// -- ACTIONS --

const fetchModel = async () => {
  isLoading.value = true
  try {
    const res = await fetch(`/api/models`)
    if (res.ok) {
      const data = await res.json()
      const items = data.items || data
      model.value = items.find((m: any) => m.id === modelId)
    }
  } catch (error) {
    console.error('Failed to load model', error)
  } finally {
    isLoading.value = false
  }
}

const saveModel = async () => {
  isSaving.value = true
  // Mock API call
  await new Promise(r => setTimeout(r, 800))
  isSaving.value = false
}

const handleResetConfirm = async () => {
  // Re-fetch data to revert changes
  await fetchModel()
  showResetDialog.value = false
}

const handleDeleteConfirm = async () => {
  isDeleting.value = true
  // Mock API Delete call
  await new Promise(r => setTimeout(r, 1000))
  isDeleting.value = false
  showDeleteDialog.value = false
  // Navigate back to settings
  router.push({ path: '/settings', query: { tab: 'models' } })
}

onMounted(fetchModel)
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
                <span class="text-xs text-muted-foreground font-mono">{{ model.id }}</span>
              </div>
            </div>
            <Switch v-model="model.enabled" />
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-2">
              <Label>Display Name</Label>
              <Input v-model="model.name" />
            </div>
            <div class="grid gap-2">
              <Label>System Prompt Override</Label>
              <Textarea
                v-model="model.system_prompt"
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
          <CardHeader>
            <CardTitle>Inference Parameters</CardTitle>
            <CardDescription>Adjust randomness and response length.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-8">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <Label class="flex items-center gap-2"
                  ><Thermometer class="size-4" /> Temperature</Label
                >
                <span class="font-mono text-sm">{{ model.parameters?.temperature ?? 0.7 }}</span>
              </div>
              <Slider
                :model-value="[model.parameters?.temperature ?? 0.7]"
                @update:model-value="(v) => { if (v && v.length > 0) model.parameters.temperature = v[0] }"
                :max="2"
                :step="0.05"
              />
              <p class="text-[0.8rem] text-muted-foreground">
                Higher values make output more random, lower values make it more deterministic.
              </p>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <Label class="flex items-center gap-2"><Box class="size-4" /> Max Tokens</Label>
                <Input
                  type="number"
                  class="w-24 h-8 text-right font-mono"
                  v-model.number="model.parameters.max_tokens"
                />
              </div>
              <p class="text-[0.8rem] text-muted-foreground">
                Maximum number of tokens to generate.
              </p>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <Label class="flex items-center gap-2"><Zap class="size-4" /> Top P</Label>
                <span class="font-mono text-sm">{{ model.parameters?.top_p ?? 1.0 }}</span>
              </div>
              <Slider
                :model-value="[model.parameters?.top_p ?? 1.0]"
                @update:model-value="(v) => { if (v && v.length > 0) model.parameters.top_p = v[0] }"
                :max="1"
                :step="0.01"
              />
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
            <div class="flex justify-between py-2 border-b">
              <span class="text-muted-foreground">Provider</span>
              <span class="font-medium truncate ml-4">{{ model.provider_id }}</span>
            </div>
            <div class="flex justify-between py-2 border-b">
              <span class="text-muted-foreground">Created</span>
              <span class="font-medium">
                {{ new Date(model.created_at).toLocaleDateString() }}
              </span>
            </div>
            <div class="flex justify-between py-2 border-b">
              <span class="text-muted-foreground">Family</span>
              <span class="font-medium">{{ model.model_family_id }}</span>
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
