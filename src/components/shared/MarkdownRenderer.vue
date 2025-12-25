<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'

const props = defineProps<{
  content: string
}>()

// Initialize parser with default settings
const md = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true
})

const renderedContent = computed(() => {
  if (!props.content) return ''
  // 1. Render Markdown to HTML
  const rawHtml = md.render(props.content)
  // 2. Sanitize HTML to prevent XSS
  return DOMPurify.sanitize(rawHtml)
})
</script>

<template>
  <div
    class="prose prose-sm prose-neutral dark:prose-invert max-w-none break-words leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
    v-html="renderedContent"
  ></div>
</template>

<style>
/* Overrides for code blocks to match the application theme.
  Tailwind typography defaults can be slightly aggressive.
*/
.prose pre {
  background-color: var(--color-muted);
  color: var(--color-foreground);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}

.prose code {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.875em;
}

.prose code::before,
.prose code::after {
  content: "";
}

.prose blockquote {
  font-style: normal;
  border-left-color: var(--color-primary);
}
</style>
