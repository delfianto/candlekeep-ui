<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ContentLayout from '@/components/layout/ContentLayout.vue'
import BrandIcon from '@/components/shared/BrandIcon.vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Save, Trash2, RotateCcw, Loader2, AlertCircle } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const route = useRoute()
const router = useRouter()
const providerId = route.params.id as string

const isLoading = ref(true)
const isSaving = ref(false)
const provider = ref<any>(null)

// Mock "Save" Action
const saveProvider = async () => {
  isSaving.value = true
  // In a real app, you'd PUT to /api/providers/:id here
  await new Promise(r => setTimeout(r, 800))
  isSaving.value = false
  // Optional: Show success toast
}

// Fetch Logic
const fetchProvider = async () => {
  isLoading.value = true
  try {
    // We fetch the full list for now since your mock might not have individual endpoints wired perfect yet
    // Or if you added the :id endpoint, use that.
    // I'll try the direct ID fetch as per standard REST, fallback to list if needed.
    const res = await fetch(`/api/providers`)
    if (res.ok) {
      const all = await res.json()
      provider.value = all.find((p: any) => p.id === providerId)
    }
  } catch (error) {
    console.error('Failed to load provider', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchProvider)
</script>

<template>
  <ContentLayout v-if="isLoading" variant="center">
    <Loader2 class="size-10 animate-spin text-muted-foreground" />
  </ContentLayout>

  <ContentLayout v-else-if="!provider" variant="center">
    <div class="text-center space-y-4">
      <AlertCircle class="size-12 text-destructive mx-auto" />
      <h2 class="text-xl font-bold">Provider Not Found</h2>
      <Button variant="outline" @click="router.push('/settings')">Return to Settings</Button>
    </div>
  </ContentLayout>

  <ContentLayout
    v-else
    variant="standard"
    :title="provider.name"
    subtitle="Configure connection details and credentials."
  >
    <template #header>
      <Button
        variant="ghost"
        size="sm"
        class="w-fit -ml-2 mb-2"
        @click="router.push({ path: '/settings', query: { tab: 'providers' } })"
      >
        <ArrowLeft class="size-4 mr-2" /> Back to Settings
      </Button>
    </template>

    <div class="max-w-3xl space-y-6">
      <Card>
        <CardHeader class="flex flex-row items-start justify-between">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-muted rounded-lg">
              <BrandIcon :name="provider.provider_type" class="size-8" />
            </div>
            <div>
              <CardTitle class="text-xl">{{ provider.name }}</CardTitle>
              <CardDescription class="font-mono text-xs mt-1">{{ provider.id }}</CardDescription>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Label for="enabled-mode">Enabled</Label>
            <Switch id="enabled-mode" v-model="provider.enabled" />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connection Settings</CardTitle>
          <CardDescription>Update API endpoints and keys.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="grid gap-2">
            <Label for="p-name">Display Name</Label>
            <Input id="p-name" v-model="provider.name" placeholder="e.g. My OpenAI" />
          </div>

          <div class="grid gap-2">
            <Label for="p-url">Base URL</Label>
            <Input id="p-url" v-model="provider.base_url" placeholder="https://api.openai.com/v1" />
            <p class="text-[0.8rem] text-muted-foreground">
              Override this if you are using a proxy or a local instance (like Ollama).
            </p>
          </div>

          <Separator />

          <div class="grid gap-2">
            <Label for="p-key">API Key</Label>
            <div class="relative">
              <Input id="p-key" type="password" placeholder="sk-..." class="pr-10" />
              <div
                v-if="provider.api_key_configured"
                class="absolute right-3 top-3 pointer-events-none"
              >
                <div
                  class="size-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                ></div>
              </div>
            </div>
            <p class="text-[0.8rem] text-muted-foreground">
              {{ provider.api_key_configured ? 'API Key is currently set.' : 'No API key configured.' }}
            </p>
          </div>
        </CardContent>
        <CardFooter class="justify-between border-t bg-muted/20 px-6 py-4">
          <Button
            variant="ghost"
            class="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 class="size-4 mr-2" /> Delete Provider
          </Button>
          <div class="flex gap-2">
            <Button variant="outline" @click="fetchProvider"
              ><RotateCcw class="size-4 mr-2" /> Reset</Button
            >
            <Button @click="saveProvider" :disabled="isSaving">
              <Loader2 v-if="isSaving" class="size-4 mr-2 animate-spin" />
              <Save v-else class="size-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  </ContentLayout>
</template>
