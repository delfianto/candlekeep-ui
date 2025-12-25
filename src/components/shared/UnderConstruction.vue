<script setup lang="ts">
import tavernImage from '@/assets/fantasy-tavern.png'

withDefaults(defineProps<{
  title?: string
  message?: string
}>(), {
  title: 'Under Construction',
  message: 'The gnomes are tinkering away at this feature. Please check back soon!'
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center h-full w-full p-6 text-center space-y-8 bg-background animate-in fade-in duration-700"
  >
    <div
      class="relative max-w-2xl w-full rounded-xl overflow-hidden shadow-2xl border border-border/50 bg-card"
    >
      <img
        :src="tavernImage"
        alt="Fantasy Tavern Under Construction"
        class="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"
      />
    </div>

    <div class="space-y-4 max-w-lg mx-auto relative z-10 -mt-20">
      <h2 class="text-5xl md:text-6xl font-medieval text-primary drop-shadow-lg tracking-wide">
        {{ title }}
      </h2>
      <p class="text-lg md:text-xl text-muted-foreground font-serif leading-relaxed italic">
        {{ message }}
      </p>
    </div>
  </div>
</template>
