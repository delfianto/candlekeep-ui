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
import { Textarea } from '@/components/ui/textarea'
import {
  AlertCircle,
  ArrowLeft,
  Box,
  Info,
  Loader2,
  RotateCcw,
  Save,
  Trash2,
  Settings2,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { client } from '@/api/client'
import type { components } from '@/api/schema'
import { toast } from 'vue-sonner'
import { useSettingsStore } from '@/stores/settings'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const route = useRoute()
const router = useRouter()
const familyId = route.params.id as string
const settingsStore = useSettingsStore()

type ModelFamily = components['schemas']['ModelFamilyResponse']

// -- STATE --
const isLoading = ref(true)
const isSaving = ref(false)
const isDeleting = ref(false)
const family = ref<ModelFamily | null>(null)

// Dialog States
const showResetDialog = ref(false)
const showDeleteDialog = ref(false)

// -- ACTIONS --

const fetchData = async () => {
  isLoading.value = true
  try {
    // Ensure docs are loaded if user navigates directly here
    const [familyRes] = await Promise.all([
      client.GET('/api/model-families/{family_id}', {
        params: { path: { family_id: familyId } },
      }),
      settingsStore.fetchParameterDocs()
    ])

    if (familyRes.error) throw familyRes.error
    family.value = {
      ...familyRes.data,
      description: familyRes.data.description ?? '',
    }
  } catch (error) {
    console.error('Failed to load model family data', error)
    toast.error('Failed to load model family details')
  } finally {
    isLoading.value = false
  }
}

const saveFamily = async () => {
  if (!family.value) return
  isSaving.value = true
  try {
    const { error } = await client.PUT('/api/model-families/{family_id}', {
      params: { path: { family_id: familyId } },
      body: {
        name: family.value.name,
        description: family.value.description,
        family_identifier: family.value.family_identifier,
        provider_types: family.value.provider_types,
        parameters: family.value.parameters as any,
        unsupported_parameters: family.value.unsupported_parameters,
        extra_metadata: family.value.extra_metadata,
      },
    })
    if (error) throw error
    toast.success('Model family saved')
  } catch (error) {
    console.error('Failed to save model family', error)
    toast.error('Failed to save model family')
  } finally {
    isSaving.value = false
  }
}

const handleResetConfirm = async () => {
  await fetchData()
  showResetDialog.value = false
}

const handleDeleteConfirm = async () => {
  isDeleting.value = true
  try {
    const { error } = await client.DELETE('/api/model-families/{family_id}', {
      params: { path: { family_id: familyId } },
    })
    if (error) throw error
    toast.success('Model family deleted')
    router.push({ path: '/settings', query: { tab: 'model-families' } })
  } catch (error) {
    console.error('Failed to delete model family', error)
    toast.error('Failed to delete model family')
  } finally {
    isDeleting.value = false
    showDeleteDialog.value = false
  }
}

onMounted(fetchData)
</script>

<template>
  <ContentLayout v-if="isLoading" variant="center">
    <Loader2 class="size-10 animate-spin text-muted-foreground" />
  </ContentLayout>

  <ContentLayout v-else-if="!family" variant="center">
    <div class="text-center space-y-4">
      <AlertCircle class="size-12 text-destructive mx-auto" />
      <h2 class="text-xl font-bold">Model Family Not Found</h2>
      <Button variant="outline" @click="router.push('/settings')">Return to Settings</Button>
    </div>
  </ContentLayout>

  <ContentLayout
    v-else
    variant="standard"
    :title="family.name"
    subtitle="Manage base parameter definitions and provider compatibility."
  >
    <template #header>
      <Button
        variant="ghost"
        size="sm"
        class="w-fit -ml-2 mb-2"
        @click="router.push({ path: '/settings', query: { tab: 'model-families' } })"
      >
        <ArrowLeft class="size-4 mr-2" /> Back to Settings
      </Button>
    </template>

    <div class="grid gap-6 xl:grid-cols-3">
      <div class="xl:col-span-2 space-y-6">
        <!-- Basic Info -->
        <Card>
          <CardHeader class="flex flex-row items-center gap-4">
            <div class="p-3 bg-primary/10 rounded-full">
              <Box class="size-6 text-primary" />
            </div>
            <div class="space-y-1 flex-1">
              <CardTitle>{{ family.name }}</CardTitle>
              <div class="flex items-center gap-2">
                <Badge variant="outline">{{ family.family_identifier }}</Badge>
                <span class="text-xs text-muted-foreground font-mono">{{ family.id }}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid gap-2">
              <Label>Family Name</Label>
              <Input v-model="family.name" placeholder="e.g. OpenAI GPT-4" />
            </div>

            <div class="grid gap-2">
              <Label>Family Identifier</Label>
              <Input v-model="family.family_identifier" placeholder="e.g. openai/gpt-4" />
              <p class="text-[0.8rem] text-muted-foreground">
                Internal identifier used for matching models to this family.
              </p>
            </div>

            <div class="grid gap-2">
              <Label>Description</Label>
              <Textarea
                v-model="(family.description as string)"
                placeholder="Describe the capabilities of this model family..."
                class="min-h-20"
              />
            </div>
          </CardContent>
        </Card>

        <!-- Parameters Definitions -->
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle>Supported Parameters</CardTitle>
                <CardDescription>Definitions for inference controls.</CardDescription>
              </div>
              <Settings2 class="size-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent class="space-y-6">
            <div v-if="Object.keys(family.parameters || {}).length === 0" class="text-sm text-muted-foreground italic py-4">
              No parameters defined for this family.
            </div>
            
            <div v-else class="space-y-4">
              <div 
                v-for="(schema, key) in (family.parameters as Record<string, any>)" 
                :key="key"
                class="p-4 border rounded-lg bg-muted/30 space-y-3"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="font-mono font-bold text-sm text-primary">{{ key }}</span>
                    <Badge variant="secondary" class="text-[10px] uppercase">{{ schema.type }}</Badge>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger as-child>
                          <Info class="size-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent v-if="settingsStore.parameterDocs[key]" class="max-w-xs">
                          <p class="font-bold mb-1">{{ settingsStore.parameterDocs[key].label }}</p>
                          <p class="text-xs">{{ settingsStore.parameterDocs[key].detailed_info }}</p>
                        </TooltipContent>
                        <TooltipContent v-else>
                          <p class="text-xs italic">No documentation available.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div class="space-y-1">
                    <Label class="text-[10px] text-muted-foreground uppercase">Default</Label>
                    <div class="font-mono">{{ schema.default !== undefined ? schema.default : 'None' }}</div>
                  </div>
                  <div v-if="schema.min_value !== undefined" class="space-y-1">
                    <Label class="text-[10px] text-muted-foreground uppercase">Min</Label>
                    <div class="font-mono">{{ schema.min_value }}</div>
                  </div>
                  <div v-if="schema.max_value !== undefined" class="space-y-1">
                    <Label class="text-[10px] text-muted-foreground uppercase">Max</Label>
                    <div class="font-mono">{{ schema.max_value }}</div>
                  </div>
                  <div v-if="schema.str_values" class="space-y-1 col-span-2">
                    <Label class="text-[10px] text-muted-foreground uppercase">Options</Label>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <Badge v-for="val in schema.str_values" :key="val" variant="outline" class="text-[9px]">
                        {{ val }}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Unsupported Parameters -->
        <Card>
          <CardHeader>
            <CardTitle>Unsupported Parameters</CardTitle>
            <CardDescription>Parameters explicitly marked as not supported by this family.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-2">
              <Badge 
                v-for="p in family.unsupported_parameters" 
                :key="p"
                variant="destructive"
                class="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20"
              >
                {{ p }}
              </Badge>
              <div v-if="!family.unsupported_parameters?.length" class="text-sm text-muted-foreground italic">
                No explicitly unsupported parameters.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle class="text-base">Metadata & Actions</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4 text-sm">
            <div class="space-y-2">
              <Label class="text-muted-foreground">Provider Types</Label>
              <div class="flex flex-wrap gap-2">
                <Badge v-for="pt in family.provider_types" :key="pt" variant="secondary">
                  {{ pt }}
                </Badge>
              </div>
            </div>

            <div class="flex justify-between py-2 border-b">
              <span class="text-muted-foreground">Created</span>
              <span class="font-medium">
                {{ new Date(family.created_at).toLocaleDateString() }}
              </span>
            </div>

            <div v-if="family.extra_metadata?.context_window" class="flex justify-between py-2 border-b">
              <span class="text-muted-foreground">Context Window</span>
              <span class="font-medium">{{ family.extra_metadata.context_window.toLocaleString() }}</span>
            </div>
            
            <div v-if="family.extra_metadata?.models" class="space-y-2 pt-2">
              <Label class="text-muted-foreground">Known Models</Label>
              <div class="flex flex-wrap gap-1">
                <Badge v-for="m in family.extra_metadata.models" :key="m" variant="outline" class="text-[10px]">
                  {{ m }}
                </Badge>
              </div>
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
              <Button class="flex-1" @click="saveFamily" :disabled="isSaving">
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
              Delete Family
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>

    <!-- Dialogs -->
    <AlertDialog :open="showResetDialog" @update:open="showResetDialog = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard changes?</AlertDialogTitle>
          <AlertDialogDescription>
            This will revert all unsaved changes to their last saved state.
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
          <AlertDialogTitle>Delete this model family?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{{ family.name }}</strong>. 
            Models relying on this family configuration may lose functionality.
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
