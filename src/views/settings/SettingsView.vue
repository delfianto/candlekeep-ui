<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ContentLayout from '@/components/layout/ContentLayout.vue'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Server, Cpu, FileText, Palette, Info, Loader2 } from 'lucide-vue-next'

// Import Tab Components
import ProvidersTab from './components/ProvidersTab.vue'
import ModelsTab from './components/ModelsTab.vue'
import TemplatesTab from './components/TemplatesTab.vue'
import InterfaceTab from './components/InterfaceTab.vue'
import AboutTab from './components/AboutTab.vue'

// -- STATE --
// We keep the state here so we can share it (e.g., ModelsTab needs Providers data)
const isLoading = ref(true)
const providers = ref([])
const models = ref([])

// -- ACTIONS --
const fetchData = async () => {
  isLoading.value = true
  try {
    const [provRes, modRes] = await Promise.all([
      fetch('/api/providers'),
      fetch('/api/models')
    ])

    if (provRes.ok) {
      const data = await provRes.json()
      providers.value = data.sort((a: any, b: any) => a.name.localeCompare(b.name))
    }

    if (modRes.ok) {
      const data = await modRes.json()
      models.value = data.sort((a: any, b: any) => a.name.localeCompare(b.name))
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchData)
</script>

<template>
  <ContentLayout
    variant="standard"
    title="Settings"
    subtitle="Manage your AI connections, models, and interface preferences."
  >
    <Tabs default-value="providers" class="space-y-6">
      <TabsList class="grid w-full grid-cols-2 md:w-180 md:grid-cols-5 bg-muted/50 p-1">
        <TabsTrigger value="providers" class="gap-2"
          ><Server class="size-4" /> Providers</TabsTrigger
        >
        <TabsTrigger value="models" class="gap-2"><Cpu class="size-4" /> Models</TabsTrigger>
        <TabsTrigger value="templates" class="gap-2"
          ><FileText class="size-4" /> Templates</TabsTrigger
        >
        <TabsTrigger value="ui" class="gap-2"><Palette class="size-4" /> Interface</TabsTrigger>
        <TabsTrigger value="about" class="gap-2"><Info class="size-4" /> About</TabsTrigger>
      </TabsList>

      <div v-if="isLoading" class="flex justify-center py-12">
        <Loader2 class="size-8 animate-spin text-muted-foreground" />
      </div>

      <template v-else>
        <TabsContent value="providers">
          <ProvidersTab :providers="providers" />
        </TabsContent>

        <TabsContent value="models">
          <ModelsTab :models="models" :providers="providers" />
        </TabsContent>

        <TabsContent value="templates">
          <TemplatesTab />
        </TabsContent>

        <TabsContent value="ui">
          <InterfaceTab />
        </TabsContent>

        <TabsContent value="about">
          <AboutTab />
        </TabsContent>
      </template>
    </Tabs>
  </ContentLayout>
</template>
