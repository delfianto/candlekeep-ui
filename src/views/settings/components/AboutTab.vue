<script setup lang="ts">
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { APP_INFO } from '@/constants/appInfo'
import BrandIcon from '@/components/shared/BrandIcon.vue'
import logoUrl from '@/assets/logo.jpg'
</script>

<template>
  <Card class="max-w-3xl mx-auto">
    <CardContent class="pt-10 pb-10 flex flex-col items-center text-center space-y-6">
      <div class="mb-4">
        <div class="size-64 flex items-center justify-center mx-auto overflow-hidden">
          <img :src="logoUrl" alt="Candlekeep Logo" class="size-full object-contain" />
        </div>
      </div>

      <div class="space-y-2">
        <p class="text-sm font-medium text-muted-foreground tracking-widest uppercase opacity-70">
          Est. 2025
        </p>
      </div>

      <p class="text-lg text-muted-foreground max-w-lg font-serif italic leading-relaxed">
        "{{ APP_INFO.description }}"
      </p>

      <Separator class="w-32 my-6" />

      <div class="space-y-4">
        <a
          :href="APP_INFO.github"
          target="_blank"
          class="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
        >
          <BrandIcon name="github" class="size-4" />
          GitHub Repository
        </a>

        <div class="flex flex-col gap-1 text-xs text-muted-foreground">
          <span>Version {{ APP_INFO.version }}</span>
          <span>{{ APP_INFO.license }}</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
