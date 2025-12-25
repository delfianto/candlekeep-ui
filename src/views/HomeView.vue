<script setup lang="ts">
import libraryImage from '@/assets/candlekeep-library.png'
import { APP_INFO } from '@/constants/appInfo'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div
    class="relative h-full w-full flex flex-col items-center justify-center p-6 text-center overflow-hidden"
  >
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0">
      <img
        :src="libraryImage"
        alt="Candlekeep Library"
        class="w-full h-full object-cover opacity-60 dark:opacity-40 blur-[1px]"
      />
      <div
        class="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent"
      />
      <div class="absolute inset-0 bg-radial-gradient from-transparent to-background/60" />
    </div>

    <div
      class="relative z-10 max-w-4xl space-y-12 animate-in fade-in duration-1000 slide-in-from-bottom-4"
    >
      <div class="space-y-6">
        <h1
          class="text-6xl md:text-8xl font-medieval text-primary drop-shadow-xl tracking-wide select-none"
        >
          Candlekeep
        </h1>
        <p
          class="text-xl md:text-2xl text-muted-foreground font-serif italic max-w-2xl mx-auto leading-relaxed"
        >
          "Enter, traveler, and find sanctuary within the walls of knowledge.
          <br class="hidden md:block" />
          Here, every story finds a listener, and every legend finds a home."
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
        <Button
          size="lg"
          class="h-14 px-10 text-xl font-medieval tracking-wide shadow-lg transition-all hover:scale-105 hover:shadow-primary/20"
          @click="router.push('/chats')"
        >
          Enter the Archives
        </Button>
        <Button
          variant="outline"
          size="lg"
          class="h-14 px-10 text-xl font-medieval tracking-wide shadow-sm hover:bg-muted/50 transition-all"
          @click="router.push('/characters')"
        >
          Visit the Roster
        </Button>
      </div>

      <div class="pt-12 text-sm text-muted-foreground/60 font-serif">
        <p>Version {{ APP_INFO.version }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-radial-gradient {
  background-image: radial-gradient(circle at center, transparent 0%, hsl(var(--background)) 100%);
}
</style>
