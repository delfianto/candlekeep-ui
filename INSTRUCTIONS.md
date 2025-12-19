## Core instructions

Rewrite the candlekeep implementation in ../candlekeep to this directory while preserving all the core stacks, change the UI from PrimeVue to shadcdn/vue. Implement proper theming support (light, dark, custom, color accents). Follow the directive below for more detailed instructions.

## Current usage and target primitives

From the repo structure (`src/components/chat`, `common`, `ui`, `layouts`, `views`), PrimeVue is likely used for form inputs, overlays, and layout primitives. The shadcn-vue layer should sit in `src/components/ui` and expose only headless, Tailwind-first building blocks.

Core primitives to implement first (map any PrimeVue usage to these):

- Layout:
  - `AppShell` (header/sidebar/content), `PageHeader`, `ScrollArea`, `Tabs`
- Inputs:
  - `Button`, `IconButton`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `Slider`
- Feedback / overlay:
  - `Dialog`, `Drawer`, `Popover`, `Tooltip`, `DropdownMenu`, `Toast`/`Sonner`, `Skeleton`, `Progress`
- Data display:
  - `Card`, `Badge`, `Avatar`, `Accordion`, `Table` (for history/logs, not heavy data grids)
- Chat-specific:
  - `ChatMessageBubble`, `ChatComposer`, `ChatSidebarItem`, `TagPill` for models/presets

Questionable ST/PrimeVue-style components you probably do NOT want to carry over:

- Monolithic `DataTable` with built-in pagination, filtering, and editing.
- Heavy `Tree`, `Timeline`, and “kitchen sink” menu components.
- Theme-specific component props that try to override Tailwind instead of using classes.

Instead, lean on small composable primitives with Tailwind classes and your own state/composables.

## Step-by-step rewrite plan

### 1. Introduce shadcn-vue + Tailwind baseline

1. Install shadcn-vue and Tailwind in the existing Vite/Vue 3 stack:
   - Use the official shadcn-vue CLI to scaffold into `src/components/ui`.
   - Keep your existing Tailwind setup; ensure `content` includes `./src/**/*.{vue,ts}` and shadcn paths.
2. Configure class utilities:
   - Add a `cn` utility in `src/lib/cn.ts` to merge classes.
   - Ensure `tailwind.config.js` extends colors and radius tokens (see theme section below).
3. Add minimal shadcn primitives:
   - `button`, `input`, `label`, `textarea`, `dialog`, `dropdown-menu`, `tabs`, `scroll-area`, `toggle`, `switch`.

At this point, you can already start migrating simple PrimeVue buttons/inputs without touching feature logic.

### 2. Define a universal theme system

Objective: All UI customization (light/dark, accents, chat bubble shapes, spacing) should flow from a single theme source, not from per-component PrimeVue props.

1. Create a **theme tokens layer** using CSS variables in `src/theme/tokens.css`:
   - Use HSL variables similar to shadcn defaults:
     - `--ck-bg`, `--ck-bg-muted`, `--ck-bg-elevated`
     - `--ck-fg`, `--ck-fg-muted`
     - `--ck-accent`, `--ck-accent-foreground`
     - `--ck-border`, `--ck-radius`, `--ck-shadow-soft`
   - Chat-specific:
     - `--ck-chat-user-bg`, `--ck-chat-assistant-bg`, `--ck-chat-system-bg`
     - `--ck-chat-user-radius`, `--ck-chat-assistant-radius`
2. Define **theme variants** using data attributes on `html` or `body`:
   - `data-theme="light"`, `data-theme="dark"`, `data-theme="custom-X"`.
   - Each variant overrides the base variables only; components always reference variables, never hardcoded colors.
3. Implement a `useTheme` composable in `src/composables/useTheme.ts`:
   - Exposes:
     - `theme: Ref<ThemeName>`
     - `accentColor: Ref<string>` (HSL or semantic name)
     - `chatBubbleStyle: Ref<'rounded' | 'pill' | 'compact'>`
   - Provides setters that:
     - Write to `localStorage` for persistence.
     - Update `document.documentElement.dataset.theme`.
     - Optionally set `document.body.classList` for Tailwind `.dark` support.
4. Wire to a Pinia store (e.g. `src/stores/uiSettings.ts`):
   - Centralize:
     - `themeMode` (light/dark/system)
     - `accentHue` (numeric 0–360 or predefined palette key)
     - `chatDensity` (comfortable/compact)
     - `fontScale`, `borderRadiusScale`, `chatLayout` (left/right, bubble alignment)
   - All configuration screens and chat UI read/write through this store.

This removes PrimeVue’s theme coupling and makes theming purely CSS-variable + store-driven.

### 3. Replace PrimeVue in `main.ts` and global styles

1. Remove global PrimeVue plugin registration from `src/main.ts`:
   - Delete `app.use(PrimeVue, { ... })`, `app.use(ToastService)`, etc.
2. Remove global PrimeVue styles from `main.ts` or `src/theme`:
   - Delete imports like `primevue/resources/primevue.min.css`, `primevue/resources/themes/...`.
   - Keep only Tailwind entry CSS and `tokens.css`.
3. Add shadcn and your token stylesheet to the main entry stylesheet:
   - `import './theme/tokens.css'`
   - `import './assets/main.css'` where Tailwind base/components/utilities are imported.

### 4. Migrate `components/ui` to shadcn primitives

Aim: `components/ui` should be the only place that knows about shadcn. Feature-level components depend on `ui` only.

For each PrimeVue mapping:

- `Button`:

```
- Replace `<Button ...>` with `<UiButton ...>` (your wrapper).
```

    - Expose `variant="default/ghost/outline"`, `size="sm/md/lg"`, `icon`, `loading`.
    - Internally use shadcn `button` styles and `cn` utility.

- `Input` / `Textarea`:
  - Wrap shadcn `Input` and `Textarea`.
  - Accept standard Vue `v-model`, `disabled`, `error` states; express error via Tailwind + CSS vars.
- `Dialog`:
  - Replace `Dialog`/`ConfirmDialog` with shadcn-style `dialog` primitives.
  - Provide your own `Modal` component that hides implementation detail:
    - `v-model:open`, `title`, `description`, `footer` slots for actions.
- `Dropdowns` / menus:
  - Replace `Menu`, `ContextMenu`, etc. with `dropdown-menu` and `context-menu` primitives.
- `Tabs` / `Sidebar`:
  - Use shadcn `tabs` for mode switching (settings sections, model/preset tabs).

Refactor path:

1. Start with global structural components:
   - Navigation header, sidebars, settings panels that use basic buttons/inputs.
2. Then overlay components:
   - Settings modal, preset editor, API key dialogs, etc.
3. Only after those primitives are solid, move to chat UI (next section).

### 5. Rebuild the chat UI in a headless way

Instead of a PrimeVue-heavy chat, define a minimal, composable toolkit:

1. `ChatLayout`:
   - Uses `AppShell`-style layout:
     - Left sidebar: conversation list, characters, models.
     - Center: message list + composer.
     - Right optional panel: tools, memory, logs.
   - Controlled entirely with Tailwind and CSS variables for spacing and background.
2. `ChatMessageList`:
   - Receives an array of message models from the store (`role`, `content`, `meta: { error, loading, tokens }`).
   - Handles:
     - Virtual scrolling (if needed, can be added later).
     - Grouping consecutive messages by same role.
3. `ChatMessageBubble`:
   - Reads `role` and uses CSS variables:
     - `bg-[hsl(var(--ck-chat-user-bg))]` vs `bg-[hsl(var(--ck-chat-assistant-bg))]`.
     - Border-radius uses `--ck-chat-user-radius` etc., controlled by user settings.
   - Supports:
     - Markdown rendering.
     - Action bar (copy, retry, delete, pin).
     - Optional tool/result blocks (like ST “tool outputs”).
4. `ChatComposer`:
   - Uses your `UiTextarea`, `UiButton`, optional `UiSelect` for model.
   - Configuration via composables:
     - `useChatComposer` for submit, stop, history, up/down arrow recall.
   - Configurable options:
     - “Enter to send” vs “Ctrl+Enter to send”.
     - Height and auto-resize behavior.
5. `ChatSidebarItem`:
   - Simple card/list item for each conversation:
     - Uses `UiButton`/`UiCard` and `Avatar` if you support characters.
     - Style driven by theme tokens; no built-in PrimeVue list behavior.

This chat stack is less opinionated than SillyTavern/NeoTavern, easier to maintain, and themable via CSS vars.

### 6. Build a dedicated “Appearance \& Chat UI” settings view

Goal: end users can tweak appearance without you fighting PrimeVue’s theming APIs.

1. Create a `views/SettingsAppearance.vue`:
   - Sections:
     - Theme:
       - Mode: `System`, `Light`, `Dark`.
       - Accent color: color picker or discrete palette (e.g. 8–12 hues).
     - Typography:
       - Font family: default/mono/serif.
       - Size: slider or `sm/md/lg`.
     - Layout:
       - Sidebar position: left/right.
       - Chat density: `Comfortable`, `Compact`.
     - Chat bubbles:
       - Shape: `Rounded`, `Pill`, `Sharp`.
       - Alignment: all left, user-right/assistant-left.
   - All fields bind to `uiSettings` store and call `useTheme` to update DOM attributes/vars.
2. Expose these same settings in a compact form:
   - Quick theme toggle in header.
   - “Compact mode” toggle in chat footer.

This addresses the pain point of PrimeVue’s scattered theme knobs and makes customization coherent.

### 7. Remove remaining PrimeVue dependencies and clean up

1. Search for any `primevue` imports:
   - Components: `Button`, `InputText`, `Dropdown`, `Dialog`, `Toast`, etc.
   - Styles: theme `.css`, icons.
2. For each:
   - Replace with your `ui` counterparts.
   - Where behavior is complex (e.g. `Toast`), implement a simple, internal system:
     - Prefer `@vueuse/core` or a very light toast system (shadcn `sonner`-style).
3. Remove PrimeIcons and replace:
   - Use a dedicated icon system (e.g. Lucide, custom SVG components).
   - Create an `Icon` component that maps names to SVGs; theme color via CSS vars.

At the end, `package.json` should no longer list `primevue` or `primeicons`.

## Components to plan for future enhancements

Given the direction of SillyTavern/NeoTavern but aiming for a cleaner architecture, these additional components are likely useful:

- **Prompt \& preset management**
  - `PresetList`, `PresetEditorDialog`, `TagPill` for models/modes.
- **Character sheets**
  - `CharacterCard`, `CharacterSheet`, `PortraitUploader`.
- **Tooling / plugins**
  - `ToolCard` (toggle tools per-chat), `ToolResultPanel`.
- **Logging \& analytics**
  - `TokenUsageBar`, `SessionStatsCard`, simple `Table` + pagination for logs.
- **Hotkey and macro UI**
  - `HotkeyList`, `HotkeyRecorder` (capture key combos and bind actions).
- **Layout variants**
  - `SplitPane`/`ResizablePanel` to create “code + chat” or “memory + chat” layouts.

All should consume your `ui` primitives and `uiSettings` store so theme and layout preferences are honored automatically.

## Why this fits Candlekeep better than ST/PrimeVue

- PrimeVue ties layout, component look, and theme together in a way that fights Tailwind; shadcn-vue is **Tailwind-first** and headless-friendly.
- SillyTavern/NeoTavern UI grew organically with many special-case controls; your plan uses small primitives and a single theme store, which is far more maintainable.
- Universal theming via CSS variables + a Pinia `uiSettings` store makes dark/light/custom accents and chat-specific appearance all consistent, without “per component” overrides.

---

# Wrote the detail skeleton code for the whole project, scaffolding for the UI elements, and so on

Below is a complete skeleton codebase to migrate from PrimeVue to shadcn-vue. It covers project structure, theme system, UI primitives, store setup, and sample feature components.

---

## Project structure

```
candlekeep/
├── src/
│   ├── assets/
│   │   ├── main.css              # Tailwind imports + global styles
│   │   └── fonts/                # Optional custom fonts
│   ├── lib/
│   │   ├── utils.ts              # cn() helper and other utilities
│   │   └── constants.ts          # App-wide constants
│   ├── theme/
│   │   ├── tokens.css            # CSS variables for theming
│   │   └── presets.ts            # Theme preset definitions
│   ├── components/
│   │   ├── ui/                   # shadcn-vue primitives (auto-generated + custom)
│   │   │   ├── button.vue
│   │   │   ├── input.vue
│   │   │   ├── textarea.vue
│   │   │   ├── dialog.vue
│   │   │   ├── dropdown-menu.vue
│   │   │   ├── tabs.vue
│   │   │   ├── scroll-area.vue
│   │   │   ├── switch.vue
│   │   │   ├── slider.vue
│   │   │   ├── card.vue
│   │   │   ├── badge.vue
│   │   │   ├── avatar.vue
│   │   │   ├── skeleton.vue
│   │   │   ├── tooltip.vue
│   │   │   ├── popover.vue
│   │   │   ├── toast.vue         # or use @vueuse/toast / sonner
│   │   │   └── index.ts          # Barrel exports
│   │   ├── layout/
│   │   │   ├── AppShell.vue      # Main layout container
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppSidebar.vue
│   │   │   └── PageHeader.vue
│   │   ├── chat/
│   │   │   ├── ChatLayout.vue
│   │   │   ├── ChatMessageList.vue
│   │   │   ├── ChatMessage.vue
│   │   │   ├── ChatComposer.vue
│   │   │   ├── ChatSidebarItem.vue
│   │   │   └── ChatToolResult.vue
│   │   └── settings/
│   │       ├── SettingsDialog.vue
│   │       ├── AppearanceSettings.vue
│   │       ├── ChatSettings.vue
│   │       └── ModelSettings.vue
│   ├── composables/
│   │   ├── useTheme.ts           # Theme management composable
│   │   ├── useChatComposer.ts    # Chat input logic
│   │   └── useHotkeys.ts         # Keyboard shortcuts
│   ├── stores/
│   │   ├── uiSettings.ts         # Pinia store for theme/appearance
│   │   ├── chat.ts               # Chat state management
│   │   └── characters.ts         # Character management
│   ├── router/
│   │   └── index.ts              # Vue Router setup
│   ├── views/
│   │   ├── ChatView.vue
│   │   ├── CharactersView.vue
│   │   ├── PresetsView.vue
│   │   └── SettingsView.vue
│   ├── App.vue
│   └── main.ts
├── tailwind.config.js
├── components.json               # shadcn-vue config
└── package.json
```

---

## Installation \& setup

### 1. Update `package.json`

```json
{
  "name": "candlekeep-ui",
  "version": "0.2.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview",
    "lint": "oxlint",
    "fmt": "oxfmt .",
    "fmt:check": "oxfmt --check .",
    "typecheck": "vue-tsc --noEmit",
    "api:gen": "openapi-typescript ../openapi.json -o ./src/api/schema.d.ts"
  },
  "dependencies": {
    "@radix-icons/vue": "^1.0.0",
    "@vueuse/core": "^11.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "lucide-vue-next": "^0.561.0",
    "openapi-fetch": "^0.15.0",
    "pinia": "^3.0.4",
    "radix-vue": "^1.9.0",
    "tailwind-merge": "^2.5.0",
    "vue": "^3.5.25",
    "vue-router": "^4.6.4"
  },
  "devDependencies": {
    "@tsconfig/node18": "^18.2.6",
    "@types/bun": "latest",
    "@vitejs/plugin-vue": "^6.0.3",
    "autoprefixer": "^10.4.23",
    "msw": "^2.12.4",
    "openapi-typescript": "^7.10.1",
    "oxlint": "^1.33.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.18",
    "typescript": "^5.9.3",
    "vite": "^8.0.0-beta.3",
    "vue-tsc": "^3.1.8"
  }
}
```

**Remove**: `primevue`, `@primevue/themes`, `primeicons`
**Add**: `radix-vue` (headless primitives), `class-variance-authority` (CVA), `clsx`, `tailwind-merge`, `@vueuse/core`

---

### 2. Initialize shadcn-vue

```bash
bunx shadcn-vue@latest init
```

When prompted:

- **Style**: `Default`
- **Color**: `Slate` (or your preference)
- **CSS variables**: `Yes`
- **Components location**: `src/components/ui`
- **Utils location**: `src/lib/utils`

This creates `components.json` and scaffolds `src/lib/utils.ts` with the `cn()` helper.

Install core primitives:

```bash
bunx shadcn-vue@latest add button input textarea dialog dropdown-menu tabs scroll-area switch slider card badge avatar skeleton tooltip popover label separator
```

---

## Core files

### `src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Optional: debounce, throttle, etc.
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}
```

---

### `src/lib/constants.ts`

```typescript
export const APP_NAME = 'Candlekeep'
export const APP_VERSION = '0.2.0'

export const THEME_MODES = ['light', 'dark', 'system'] as const
export type ThemeMode = (typeof THEME_MODES)[number]

export const ACCENT_COLORS = {
  slate: 'hsl(215 25% 45%)',
  blue: 'hsl(217 91% 60%)',
  violet: 'hsl(262 83% 58%)',
  pink: 'hsl(316 73% 52%)',
  orange: 'hsl(25 95% 53%)',
  green: 'hsl(142 71% 45%)',
} as const

export const CHAT_BUBBLE_STYLES = ['rounded', 'pill', 'compact'] as const
export type ChatBubbleStyle = (typeof CHAT_BUBBLE_STYLES)[number]

export const CHAT_DENSITIES = ['comfortable', 'compact'] as const
export type ChatDensity = (typeof CHAT_DENSITIES)[number]
```

---

### `src/theme/tokens.css`

```css
@layer base {
  :root {
    /* Base colors */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    /* Muted backgrounds */
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    /* Elevated surfaces (cards, modals) */
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    /* Popover backgrounds */
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    /* Borders and inputs */
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;

    /* Primary/accent color */
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;

    /* Secondary variants */
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    /* Accent (theme color) */
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    /* Destructive states */
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    /* Rings and focus indicators */
    --ring: 222.2 84% 4.9%;

    /* Border radius tokens */
    --radius-sm: 0.25rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;

    /* Chat-specific tokens */
    --chat-user-bg: 217 91% 60%;
    --chat-user-fg: 210 40% 98%;
    --chat-assistant-bg: 210 40% 96.1%;
    --chat-assistant-fg: 222.2 84% 4.9%;
    --chat-system-bg: 210 40% 93%;
    --chat-system-fg: 222.2 47.4% 11.2%;

    --chat-bubble-radius: var(--radius-lg);
    --chat-spacing: 1rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --ring: 212.7 26.8% 83.9%;

    /* Dark mode chat colors */
    --chat-user-bg: 217 91% 60%;
    --chat-user-fg: 210 40% 98%;
    --chat-assistant-bg: 217.2 32.6% 17.5%;
    --chat-assistant-fg: 210 40% 98%;
    --chat-system-bg: 217.2 32.6% 14%;
    --chat-system-fg: 215 20.2% 65.1%;
  }
}
```

---

### `src/theme/presets.ts`

```typescript
import { ACCENT_COLORS } from '@/lib/constants'

export interface ThemePreset {
  id: string
  name: string
  accentColor: string
}

export const themePresets: ThemePreset[] = [
  { id: 'slate', name: 'Slate', accentColor: ACCENT_COLORS.slate },
  { id: 'blue', name: 'Blue', accentColor: ACCENT_COLORS.blue },
  { id: 'violet', name: 'Violet', accentColor: ACCENT_COLORS.violet },
  { id: 'pink', name: 'Pink', accentColor: ACCENT_COLORS.pink },
  { id: 'orange', name: 'Orange', accentColor: ACCENT_COLORS.orange },
  { id: 'green', name: 'Green', accentColor: ACCENT_COLORS.green },
]
```

---

### `src/stores/uiSettings.ts`

```typescript
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ThemeMode, ChatBubbleStyle, ChatDensity } from '@/lib/constants'

export const useUISettingsStore = defineStore('uiSettings', () => {
  // Theme
  const themeMode = ref<ThemeMode>(
    (localStorage.getItem('theme-mode') as ThemeMode) || 'system'
  )
  const accentColor = ref(localStorage.getItem('accent-color') || 'blue')

  // Chat UI
  const chatBubbleStyle = ref<ChatBubbleStyle>(
    (localStorage.getItem('chat-bubble-style') as ChatBubbleStyle) || 'rounded'
  )
  const chatDensity = ref<ChatDensity>(
    (localStorage.getItem('chat-density') as ChatDensity) || 'comfortable'
  )
  const chatAlignment = ref<'left' | 'alternate'>(
    (localStorage.getItem('chat-alignment') as 'left' | 'alternate') || 'alternate'
  )

  // Typography
  const fontSize = ref(Number(localStorage.getItem('font-size')) || 16)
  const fontFamily = ref(localStorage.getItem('font-family') || 'system')

  // Layout
  const sidebarPosition = ref<'left' | 'right'>(
    (localStorage.getItem('sidebar-position') as 'left' | 'right') || 'left'
  )

  // Persist to localStorage
  watch(themeMode, (val) => localStorage.setItem('theme-mode', val))
  watch(accentColor, (val) => localStorage.setItem('accent-color', val))
  watch(chatBubbleStyle, (val) => localStorage.setItem('chat-bubble-style', val))
  watch(chatDensity, (val) => localStorage.setItem('chat-density', val))
  watch(chatAlignment, (val) => localStorage.setItem('chat-alignment', val))
  watch(fontSize, (val) => localStorage.setItem('font-size', String(val)))
  watch(fontFamily, (val) => localStorage.setItem('font-family', val))
  watch(sidebarPosition, (val) => localStorage.setItem('sidebar-position', val))

  return {
    themeMode,
    accentColor,
    chatBubbleStyle,
    chatDensity,
    chatAlignment,
    fontSize,
    fontFamily,
    sidebarPosition,
  }
})
```

---

### `src/composables/useTheme.ts`

```typescript
import { computed, watch } from 'vue'
import { useUISettingsStore } from '@/stores/uiSettings'
import { ACCENT_COLORS } from '@/lib/constants'

export function useTheme() {
  const settings = useUISettingsStore()

  const isDark = computed(() => {
    if (settings.themeMode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return settings.themeMode === 'dark'
  })

  // Apply dark class
  watch(
    isDark,
    (dark) => {
      if (dark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    { immediate: true }
  )

  // Apply accent color as CSS variable
  watch(
    () => settings.accentColor,
    (color) => {
      const hsl = ACCENT_COLORS[color as keyof typeof ACCENT_COLORS]
      if (hsl) {
        document.documentElement.style.setProperty('--accent', hsl)
      }
    },
    { immediate: true }
  )

  // Apply font size
  watch(
    () => settings.fontSize,
    (size) => {
      document.documentElement.style.fontSize = `${size}px`
    },
    { immediate: true }
  )

  // Apply chat bubble radius based on style
  watch(
    () => settings.chatBubbleStyle,
    (style) => {
      const radiusMap = {
        rounded: 'var(--radius-lg)',
        pill: 'var(--radius-xl)',
        compact: 'var(--radius-sm)',
      }
      document.documentElement.style.setProperty(
        '--chat-bubble-radius',
        radiusMap[style]
      )
    },
    { immediate: true }
  )

  return {
    isDark,
    themeMode: computed(() => settings.themeMode),
    accentColor: computed(() => settings.accentColor),
    chatBubbleStyle: computed(() => settings.chatBubbleStyle),
    setThemeMode: (mode: typeof settings.themeMode) => {
      settings.themeMode = mode
    },
    setAccentColor: (color: string) => {
      settings.accentColor = color
    },
    setChatBubbleStyle: (style: typeof settings.chatBubbleStyle) => {
      settings.chatBubbleStyle = style
    },
  }
}
```

---

### `src/main.ts` (cleaned up)

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'

import './assets/main.css'
import './theme/tokens.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

async function prepareApp() {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true') {
    const { worker } = await import('./mocks/browser')
    return worker.start()
  }
}

prepareApp().then(() => {
  app.mount('#app')
})
```

---

### `src/assets/main.css`

```css
@import 'tailwindcss';

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }
}
```

---

### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chat: {
          user: {
            bg: 'hsl(var(--chat-user-bg))',
            fg: 'hsl(var(--chat-user-fg))',
          },
          assistant: {
            bg: 'hsl(var(--chat-assistant-bg))',
            fg: 'hsl(var(--chat-assistant-fg))',
          },
          system: {
            bg: 'hsl(var(--chat-system-bg))',
            fg: 'hsl(var(--chat-system-fg))',
          },
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
    },
  },
  plugins: [],
}
```

---

## Layout components

### `src/components/layout/AppShell.vue`

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useUISettingsStore } from '@/stores/uiSettings'

defineProps<{
  withSidebar?: boolean
}>()

const settings = useUISettingsStore()

const layoutClasses = computed(() => ({
  'grid-cols-[auto_1fr]': settings.sidebarPosition === 'left',
  'grid-cols-[1fr_auto]': settings.sidebarPosition === 'right',
}))
</script>

<template>
  <div class="flex h-screen flex-col">
    <slot name="header" />
    <div v-if="withSidebar" class="grid flex-1 overflow-hidden" :class="layoutClasses">
      <slot v-if="settings.sidebarPosition === 'left'" name="sidebar" />
      <slot name="content" />
      <slot v-if="settings.sidebarPosition === 'right'" name="sidebar" />
    </div>
    <slot v-else name="content" />
  </div>
</template>
```

---

### `src/components/layout/AppHeader.vue`

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Menu, Settings, Moon, Sun } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'

const emit = defineEmits<{
  toggleSidebar: []
  openSettings: []
}>()

const { isDark, setThemeMode } = useTheme()

function toggleTheme() {
  setThemeMode(isDark.value ? 'light' : 'dark')
}
</script>

<template>
  <header class="flex h-14 items-center gap-3 border-b bg-background px-4">
    <Button variant="ghost" size="icon" @click="emit('toggleSidebar')">
      <Menu class="h-5 w-5" />
    </Button>
    <h1 class="text-lg font-semibold">Candlekeep</h1>
    <div class="ml-auto flex items-center gap-2">
      <Button variant="ghost" size="icon" @click="toggleTheme">
        <Moon v-if="!isDark" class="h-5 w-5" />
        <Sun v-else class="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" @click="emit('openSettings')">
        <Settings class="h-5 w-5" />
      </Button>
    </div>
  </header>
</template>
```

---

### `src/components/layout/AppSidebar.vue`

```vue
<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { MessageSquare, Users, Sliders, BookOpen } from 'lucide-vue-next'

const navItems = [
  { icon: MessageSquare, label: 'Chat', to: '/chat' },
  { icon: Users, label: 'Characters', to: '/characters' },
  { icon: Sliders, label: 'Presets', to: '/presets' },
  { icon: BookOpen, label: 'Lorebooks', to: '/lorebooks' },
]
</script>

<template>
  <aside class="w-64 border-r bg-muted/30">
    <ScrollArea class="h-full">
      <nav class="flex flex-col gap-1 p-2">
        <Button
          v-for="item in navItems"
          :key="item.to"
          variant="ghost"
          class="justify-start"
          as-child
        >
          <RouterLink :to="item.to" class="flex items-center gap-2">
            <component :is="item.icon" class="h-4 w-4" />
            {{ item.label }}
          </RouterLink>
        </Button>
      </nav>
    </ScrollArea>
  </aside>
</template>
```

---

## Chat components

### `src/components/chat/ChatLayout.vue`

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ChatMessageList from './ChatMessageList.vue'
import ChatComposer from './ChatComposer.vue'
import ChatSidebar from './ChatSidebar.vue'

const showConversations = ref(true)
</script>

<template>
  <div class="grid h-full grid-cols-[auto_1fr]">
    <ChatSidebar v-if="showConversations" />
    <div class="flex flex-col">
      <ChatMessageList class="flex-1" />
      <ChatComposer />
    </div>
  </div>
</template>
```

---

### `src/components/chat/ChatMessageList.vue`

```vue
<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area'
import ChatMessage from './ChatMessage.vue'
import { useChatStore } from '@/stores/chat'

const chat = useChatStore()
</script>

<template>
  <ScrollArea class="flex-1 p-4">
    <div class="mx-auto max-w-4xl space-y-4">
      <ChatMessage
        v-for="msg in chat.currentMessages"
        :key="msg.id"
        :message="msg"
      />
    </div>
  </ScrollArea>
</template>
```

---

### `src/components/chat/ChatMessage.vue`

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Copy, RotateCcw, Trash2 } from 'lucide-vue-next'
import { useUISettingsStore } from '@/stores/uiSettings'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: number
}

const props = defineProps<{
  message: Message
}>()

const settings = useUISettingsStore()

const bubbleClasses = computed(() => {
  const base = 'px-4 py-3 shadow-sm'
  const roleMap = {
    user: 'bg-chat-user-bg text-chat-user-fg ml-auto',
    assistant: 'bg-chat-assistant-bg text-chat-assistant-fg',
    system: 'bg-chat-system-bg text-chat-system-fg italic',
  }
  const densityPadding = settings.chatDensity === 'compact' ? 'px-3 py-2 text-sm' : 'px-4 py-3'
  return `${base} ${roleMap[props.message.role]} ${densityPadding} rounded-[var(--chat-bubble-radius)]`
})

const showActions = computed(() => props.message.role !== 'system')
</script>

<template>
  <div class="group flex items-start gap-3">
    <Avatar v-if="message.role === 'assistant'" class="h-8 w-8">
      <AvatarFallback>AI</AvatarFallback>
    </Avatar>
    <div class="flex flex-1 flex-col gap-2">
      <div :class="bubbleClasses" class="max-w-[85%]">
        <div class="prose prose-sm dark:prose-invert max-w-none">
          {{ message.content }}
        </div>
      </div>
      <div v-if="showActions" class="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button variant="ghost" size="icon" class="h-7 w-7">
          <Copy class="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" class="h-7 w-7">
          <RotateCcw class="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" class="h-7 w-7 text-destructive">
          <Trash2 class="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
    <Avatar v-if="message.role === 'user'" class="h-8 w-8">
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  </div>
</template>
```

---

### `src/components/chat/ChatComposer.vue`

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send, Square } from 'lucide-vue-next'
import { useChatStore } from '@/stores/chat'

const chat = useChatStore()
const input = ref('')
const isGenerating = ref(false)

function handleSubmit() {
  if (!input.value.trim() || isGenerating.value) return
  chat.sendMessage(input.value)
  input.value = ''
}

function stopGeneration() {
  isGenerating.value = false
  // TODO: implement abort
}
</script>

<template>
  <div class="border-t bg-background p-4">
    <div class="mx-auto flex max-w-4xl gap-2">
      <Textarea
        v-model="input"
        placeholder="Type your message..."
        class="min-h-[60px] resize-none"
        @keydown.ctrl.enter="handleSubmit"
      />
      <Button v-if="!isGenerating" @click="handleSubmit">
        <Send class="h-4 w-4" />
      </Button>
      <Button v-else variant="destructive" @click="stopGeneration">
        <Square class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
```

---

## Settings components

### `src/components/settings/AppearanceSettings.vue`

```vue
<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { useUISettingsStore } from '@/stores/uiSettings'
import { themePresets } from '@/theme/presets'
import { CHAT_BUBBLE_STYLES } from '@/lib/constants'

const settings = useUISettingsStore()
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="mb-3 text-lg font-semibold">Theme Mode</h3>
      <div class="flex gap-2">
        <Button
          v-for="mode in ['light', 'dark', 'system']"
          :key="mode"
          :variant="settings.themeMode === mode ? 'default' : 'outline'"
          @click="settings.themeMode = mode"
        >
          {{ mode }}
        </Button>
      </div>
    </div>

    <div>
      <h3 class="mb-3 text-lg font-semibold">Accent Color</h3>
      <div class="flex gap-2">
        <Button
          v-for="preset in themePresets"
          :key="preset.id"
          :variant="settings.accentColor === preset.id ? 'default' : 'outline'"
          @click="settings.accentColor = preset.id"
        >
          {{ preset.name }}
        </Button>
      </div>
    </div>

    <div>
      <h3 class="mb-3 text-lg font-semibold">Chat Bubble Style</h3>
      <div class="flex gap-2">
        <Button
          v-for="style in CHAT_BUBBLE_STYLES"
          :key="style"
          :variant="settings.chatBubbleStyle === style ? 'default' : 'outline'"
          @click="settings.chatBubbleStyle = style"
        >
          {{ style }}
        </Button>
      </div>
    </div>

    <div>
      <Label for="font-size">Font Size: {{ settings.fontSize }}px</Label>
      <Slider
        id="font-size"
        v-model="settings.fontSize"
        :min="12"
        :max="20"
        :step="1"
        class="mt-2"
      />
    </div>

    <div class="flex items-center justify-between">
      <Label for="compact-mode">Compact Chat Mode</Label>
      <Switch
        id="compact-mode"
        :checked="settings.chatDensity === 'compact'"
        @update:checked="settings.chatDensity = $event ? 'compact' : 'comfortable'"
      />
    </div>
  </div>
</template>
```

---

### `src/components/settings/SettingsDialog.vue`

```vue
<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AppearanceSettings from './AppearanceSettings.vue'

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
      </DialogHeader>
      <Tabs default-value="appearance" class="mt-4">
        <TabsList>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
        </TabsList>
        <TabsContent value="appearance" class="mt-4">
          <AppearanceSettings />
        </TabsContent>
        <TabsContent value="chat">
          <!-- Chat settings -->
        </TabsContent>
        <TabsContent value="models">
          <!-- Model settings -->
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
</template>
```

---

### `src/App.vue`

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '@/composables/useTheme'
import AppShell from '@/components/layout/AppShell.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import SettingsDialog from '@/components/settings/SettingsDialog.vue'

useTheme()

const showSidebar = ref(true)
const showSettings = ref(false)
</script>

<template>
  <AppShell :with-sidebar="showSidebar">
    <template #header>
      <AppHeader
        @toggle-sidebar="showSidebar = !showSidebar"
        @open-settings="showSettings = true"
      />
    </template>
    <template #sidebar>
      <AppSidebar />
    </template>
    <template #content>
      <RouterView />
    </template>
  </AppShell>

  <SettingsDialog v-model:open="showSettings" />
</template>
```

---

## Summary

This skeleton delivers:

1. **Full PrimeVue removal**: No `primevue` imports, replaced with shadcn-vue primitives.
2. **Universal theming**: CSS variables + Pinia store drive all appearance.
3. **Chat UI**: Message bubbles, composer, sidebar—all themeable via `uiSettings`.
4. **Appearance settings**: Users can toggle light/dark, accent colors, chat bubble styles, font size, and layout density.
5. **Modern architecture**: Clean separation of primitives (`ui`), features (`chat`, `settings`), state (`stores`), and theme (`theme/`).

**Next steps**:

- Add markdown rendering in `ChatMessage` (e.g., `marked` or `markdown-it`).
- Wire `chat.ts` store to your backend via `openapi-fetch`.
- Implement character/preset management views.
- Add toast notifications using `@vueuse/core` or a lightweight toast system.
