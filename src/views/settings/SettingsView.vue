<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import ContentLayout from '@/components/layout/ContentLayout.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Server, Cpu, FileText, Palette, Info, Loader2, Layers, Menu } from 'lucide-vue-next'

import ProvidersTab from './components/ProvidersTab.vue'
import ModelFamiliesTab from './components/ModelFamiliesTab.vue'
import ModelsTab from './components/ModelsTab.vue'
import TemplatesTab from './components/TemplatesTab.vue'
import InterfaceTab from './components/InterfaceTab.vue'
import AboutTab from './components/AboutTab.vue'

// Keep the state here so we can share it
// e.g., ModelsTab needs Providers data
const settingsStore = useSettingsStore()
const isLoading = computed(() => settingsStore.isLoadingProviders)
const providers = computed(() => settingsStore.providers)

const route = useRoute()
const router = useRouter()
const isMobileMenuOpen = ref(false)

const tabsConfig = [
  { value: 'providers', label: 'Providers', icon: Server },
  { value: 'model-families', label: 'Families', icon: Layers },
  { value: 'models', label: 'Models', icon: Cpu },
  { value: 'templates', label: 'Templates', icon: FileText },
  { value: 'ui', label: 'Interface', icon: Palette },
  { value: 'about', label: 'About', icon: Info },
]

const activeTab = ref<string>((route.query.tab as string) || 'providers')
watch(activeTab, (newTab) => {
  router.replace({ query: { ...route.query, tab: newTab } })
  isMobileMenuOpen.value = false
})

const currentTabLabel = computed(() => {
  return tabsConfig.find(t => t.value === activeTab.value)?.label || 'Settings'
})

const fetchData = async () => {
  await settingsStore.fetchProviders()
}

onMounted(fetchData)
</script>

<template>
  <ContentLayout variant="standard">
    <Tabs v-model="activeTab" class="space-y-6">
      <!-- MOBILE HEADER -->
      <div
        class="md:hidden sticky -top-4 -mx-4 -mt-4 p-4 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b flex items-center justify-between mb-4"
      >
        <h2 class="text-lg font-semibold flex items-center gap-2">
          <component :is="tabsConfig.find(t => t.value === activeTab)?.icon" class="size-5" />
          {{ currentTabLabel }}
        </h2>
        <Sheet v-model:open="isMobileMenuOpen">
          <SheetTrigger as-child>
            <Button variant="ghost" size="icon">
              <Menu class="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" class="w-full">
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
              <SheetDescription>Manage application preferences.</SheetDescription>
            </SheetHeader>
            <div class="grid grid-cols-2 gap-2 py-4">
              <Button
                v-for="tab in tabsConfig"
                :key="tab.value"
                variant="ghost"
                class="w-full justify-start gap-3"
                :class="activeTab === tab.value ? 'bg-secondary' : ''"
                @click="activeTab = tab.value"
              >
                <component :is="tab.icon" class="size-4" />
                {{ tab.label }}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <!-- DESKTOP TABS LIST -->
      <TabsList class="hidden md:grid w-full md:w-180 md:grid-cols-6 bg-muted/50 p-1">
        <TabsTrigger v-for="tab in tabsConfig" :key="tab.value" :value="tab.value" class="gap-2">
          <component :is="tab.icon" class="size-4" />
          {{ tab.label }}
        </TabsTrigger>
      </TabsList>

      <div v-if="isLoading" class="flex justify-center py-12">
        <Loader2 class="size-8 animate-spin text-muted-foreground" />
      </div>

      <template v-else>
        <TabsContent value="providers">
          <ProvidersTab :providers="providers" />
        </TabsContent>

        <TabsContent value="model-families">
          <ModelFamiliesTab />
        </TabsContent>

        <TabsContent value="models">
          <ModelsTab :providers="providers" />
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
