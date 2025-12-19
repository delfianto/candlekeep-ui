<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ContentLayout from '@/components/layout/ContentLayout.vue'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Server,
  Cpu,
  FileText,
  Palette,
  Plus,
  Edit,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-vue-next'

// -- TYPES --
interface Provider {
  id: string
  name: string
  provider_type: string
  base_url: string | null
  enabled: boolean
  api_key_configured: boolean
}

interface Model {
  id: string
  name: string
  provider_id: string
  model_identifier: string
  enabled: boolean
}

// -- STATE --
const isLoading = ref(true)
const providers = ref<Provider[]>([])
const models = ref<Model[]>([])

const templates = ref([
  { id: 1, name: 'Creative Writer', description: 'For storytelling and RPG elements.', preview: 'You are an expert storyteller...' },
  { id: 2, name: 'Code Assistant', description: 'Strict logic and clean code output.', preview: 'You are a senior software engineer...' },
  { id: 3, name: 'Dungeon Master', description: 'Game logic and world state management.', preview: 'You are the keeper of the rules...' },
])

// -- ACTIONS --
const fetchData = async () => {
  isLoading.value = true
  try {
    const [provRes, modRes] = await Promise.all([
      fetch('/api/providers'),
      fetch('/api/models')
    ])

    if (provRes.ok) providers.value = await provRes.json()
    if (modRes.ok) models.value = await modRes.json()

    // DEBUG: Check for ID mismatch if names are missing
    if (models.value.length > 0 && providers.value.length > 0) {
      const missing = models.value.filter(m => !providers.value.find(p => p.id === m.provider_id));
      if (missing.length > 0) {
        console.warn("Data Mismatch: Some models reference provider IDs that don't exist in the provider list.",
          {
            modelProviderIds: missing.map(m => m.provider_id),
            availableProviderIds: providers.value.map(p => p.id)
          }
        );
      }
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  } finally {
    isLoading.value = false
  }
}

const getProviderName = (providerId: string) => {
  const p = providers.value.find(p => p.id === providerId)
  return p ? p.name : 'Unknown'
}

// -- LIFECYCLE --
onMounted(() => {
  fetchData()
})
</script>

<template>
  <ContentLayout
    variant="standard"
    title="Settings"
    subtitle="Manage your AI connections, models, and interface preferences."
  >
    <Tabs default-value="providers" class="space-y-6">
      <TabsList class="grid w-full grid-cols-2 md:w-150 md:grid-cols-4 bg-muted/50 p-1">
        <TabsTrigger value="providers" class="flex items-center gap-2"
          ><Server class="size-4" /> Providers</TabsTrigger
        >
        <TabsTrigger value="models" class="flex items-center gap-2"
          ><Cpu class="size-4" /> Models</TabsTrigger
        >
        <TabsTrigger value="templates" class="flex items-center gap-2"
          ><FileText class="size-4" /> Templates</TabsTrigger
        >
        <TabsTrigger value="ui" class="flex items-center gap-2"
          ><Palette class="size-4" /> Interface</TabsTrigger
        >
      </TabsList>

      <div v-if="isLoading" class="flex justify-center py-12">
        <Loader2 class="size-8 animate-spin text-muted-foreground" />
      </div>

      <template v-else>
        <TabsContent value="providers" class="space-y-4">
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card
              v-for="prov in providers"
              :key="prov.id"
              :class="prov.enabled ? 'border-primary/50 bg-primary/5' : ''"
            >
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-lg font-bold">{{ prov.name }}</CardTitle>
                <Badge :variant="prov.enabled ? 'default' : 'outline'">
                  {{ prov.enabled ? 'Active' : 'Disabled' }}
                </Badge>
              </CardHeader>
              <CardContent class="pt-4">
                <div class="flex items-center space-x-2 text-sm text-muted-foreground">
                  <component :is="prov.enabled ? CheckCircle2 : AlertCircle" class="size-4" />
                  <span>
                    {{ prov.api_key_configured ? 'Key Configured' : 'Missing API Key' }}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" class="w-full">Configure</Button>
              </CardFooter>
            </Card>

            <Card
              class="flex flex-col items-center justify-center border-dashed border-2 hover:border-primary/50 cursor-pointer transition-colors h-45"
            >
              <div class="flex flex-col items-center gap-2 text-muted-foreground">
                <Plus class="size-8" />
                <span class="font-medium">Add Provider</span>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Model Registry</CardTitle>
                <CardDescription
                  >Available models fetched from connected providers.</CardDescription
                >
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
                        <span
                          class="font-mono text-[10px] opacity-70"
                          >{{ model.model_identifier }}</span
                        >
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
                    <Button variant="ghost" size="icon"><Edit class="size-4" /></Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </template>

      <TabsContent value="templates">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="temp in templates" :key="temp.id" class="group relative overflow-hidden">
            <CardHeader>
              <CardTitle>{{ temp.name }}</CardTitle>
              <CardDescription>{{ temp.description }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                class="bg-muted p-3 rounded-md text-xs font-mono text-muted-foreground line-clamp-3"
              >
                {{ temp.preview }}
              </div>
            </CardContent>
            <CardFooter class="flex justify-between">
              <Button variant="ghost" size="sm" class="text-xs">Edit</Button>
              <Button
                variant="ghost"
                size="sm"
                class="text-xs text-destructive hover:text-destructive"
                >Delete</Button
              >
            </CardFooter>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="ui">
        <Card>
          <CardHeader>
            <CardTitle>Appearance & Behavior</CardTitle>
            <CardDescription>Customize how Candlekeep looks and feels.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label class="text-base">Stream Responses</Label>
                <p class="text-sm text-muted-foreground">
                  Show text as it is being generated by the LLM.
                </p>
              </div>
              <Switch checked />
            </div>
            <Separator />
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label class="text-base">Compact Mode</Label>
                <p class="text-sm text-muted-foreground">
                  Reduce padding and font sizes for high-density displays.
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div class="space-y-2">
              <Label>Theme Preset</Label>
              <div class="grid grid-cols-3 gap-4">
                <div
                  class="h-20 rounded-md bg-zinc-950 border-2 border-primary cursor-pointer flex items-center justify-center text-zinc-50 font-medium"
                >
                  Midnight
                </div>
                <div
                  class="h-20 rounded-md bg-zinc-100 border border-border cursor-pointer flex items-center justify-center text-zinc-900 font-medium hover:border-primary/50"
                >
                  Paper
                </div>
                <div
                  class="h-20 rounded-md bg-slate-900 border border-border cursor-pointer flex items-center justify-center text-slate-50 font-medium hover:border-primary/50"
                >
                  Deep Sea
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </ContentLayout>
</template>
