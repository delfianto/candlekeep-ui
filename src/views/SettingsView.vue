<script setup lang="ts">
import { ref } from 'vue'
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
  AlertCircle
} from 'lucide-vue-next'

// -- MOCK DATA (Same as before) --
const providers = ref([
  { id: 'openai', name: 'OpenAI', connected: true, key: 'sk-...' },
  { id: 'anthropic', name: 'Anthropic', connected: false, key: '' },
  { id: 'ollama', name: 'Ollama', connected: true, endpoint: 'http://localhost:11434' },
])

const models = ref([
  { id: 1, name: 'Llama 3 70b', provider: 'Ollama', context: '8k', active: true },
  { id: 2, name: 'GPT-4o', provider: 'OpenAI', context: '128k', active: true },
  { id: 3, name: 'Claude 3.5 Sonnet', provider: 'Anthropic', context: '200k', active: false },
])

const templates = ref([
  { id: 1, name: 'Creative Writer', description: 'For storytelling and RPG elements.', preview: 'You are an expert storyteller...' },
  { id: 2, name: 'Code Assistant', description: 'Strict logic and clean code output.', preview: 'You are a senior software engineer...' },
  { id: 3, name: 'Dungeon Master', description: 'Game logic and world state management.', preview: 'You are the keeper of the rules...' },
])
</script>

<template>
  <ContentLayout
    variant="standard"
    title="Settings"
    subtitle="Manage your AI connections, models, and interface preferences."
  >
    <Tabs default-value="providers" class="space-y-6">
      <TabsList class="grid w-full grid-cols-2 md:w-[600px] md:grid-cols-4 bg-muted/50 p-1">
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

      <TabsContent value="providers" class="space-y-4">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card
            v-for="prov in providers"
            :key="prov.id"
            :class="prov.connected ? 'border-primary/50 bg-primary/5' : ''"
          >
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-lg font-bold">{{ prov.name }}</CardTitle>
              <Badge
                :variant="prov.connected ? 'default' : 'outline'"
                >{{ prov.connected ? 'Connected' : 'Offline' }}</Badge
              >
            </CardHeader>
            <CardContent class="pt-4">
              <div class="flex items-center space-x-2 text-sm text-muted-foreground">
                <component :is="prov.connected ? CheckCircle2 : AlertCircle" class="size-4" />
                <span>{{ prov.connected ? 'Ready to generate' : 'Configuration missing' }}</span>
              </div>
            </CardContent>
            <CardFooter><Button variant="outline" class="w-full">Configure</Button></CardFooter>
          </Card>
          <Card
            class="flex flex-col items-center justify-center border-dashed border-2 hover:border-primary/50 cursor-pointer transition-colors h-[180px]"
          >
            <div class="flex flex-col items-center gap-2 text-muted-foreground">
              <Plus class="size-8" /><span class="font-medium">Add Provider</span>
            </div>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="models">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Model Registry</CardTitle
              ><CardDescription>Configure available models.</CardDescription>
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
                      <Badge variant="secondary" class="text-[10px]">{{ model.provider }}</Badge
                      ><span>Context: {{ model.context }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="flex items-center space-x-2">
                    <Switch :id="`model-${model.id}`" :checked="model.active" /><Label
                      :for="`model-${model.id}`"
                      class="text-xs text-muted-foreground"
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

      <TabsContent value="templates">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="temp in templates" :key="temp.id" class="group relative overflow-hidden">
            <CardHeader
              ><CardTitle>{{ temp.name }}</CardTitle
              ><CardDescription>{{ temp.description }}</CardDescription></CardHeader
            >
            <CardContent
              ><div
                class="bg-muted p-3 rounded-md text-xs font-mono text-muted-foreground line-clamp-3"
              >
                {{ temp.preview }}
              </div></CardContent
            >
            <CardFooter class="flex justify-between"
              ><Button variant="ghost" size="sm" class="text-xs">Edit</Button
              ><Button
                variant="ghost"
                size="sm"
                class="text-xs text-destructive hover:text-destructive"
                >Delete</Button
              ></CardFooter
            >
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="ui">
        <Card>
          <CardHeader
            ><CardTitle>Appearance</CardTitle
            ><CardDescription>Interface preferences.</CardDescription></CardHeader
          >
          <CardContent class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label class="text-base">Stream Responses</Label>
                <p class="text-sm text-muted-foreground">Show text as it generates.</p>
              </div>
              <Switch checked />
            </div>
            <Separator />
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label class="text-base">Compact Mode</Label>
                <p class="text-sm text-muted-foreground">High density display.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </ContentLayout>
</template>
