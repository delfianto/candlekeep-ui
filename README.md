# Project Context: Candlekeep UI

## Project Overview

Candlekeep UI is a greenfield project built from scratch, aiming to deliver a modern, high-fidelity UI for Roleplay (RP) chat with Large Language Models (LLMs). It serves as the official frontend for [Candlekeep Core](https://github.com/delfianto/candlekeep-core/tree/develop), a Python-based backend. The project is build on top of Vue 3, Vite, and the `shadcn-vue` component library.

## Tech Stack

- **Framework:** [Vue 3](https://vuejs.org/) (Composition API)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Library:** [shadcn-vue](https://www.shadcn-vue.com/) (New York style)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Routing:** [Vue Router](https://router.vuejs.org/)
- **API Client:** `openapi-fetch` (Type-safe fetch client)
- **Icons:** `lucide-vue-next`
- **Linting/Formatting:** `oxlint`, `oxfmt`
- **Mocking:** `msw` (Mock Service Worker)

## Key Commands

**Note: This project uses [Bun](https://bun.sh/) as the package manager. Always use `bun` instead of `npm`.**

### Development

- **Start Dev Server:** `bun run dev` (Runs on port 5173 by default, proxies `/api` to `http://localhost:8000`)

- **Type Check:** `bun run typecheck`

- **Lint Code:** `bun run lint`

- **Format Code:** `bun run fmt`

### Build

- **Build for Production:** `bun run build`

- **Preview Production Build:** `bun run preview`

### API Management

- **Generate API Schema:** `bun run api:gen`
  - Re-generates `src/api/schema.d.ts` from `openapi.json`.

  - Run this after updating the backend `openapi.json` file.

## Project Structure & Conventions

### Directory Structure

- `src/api`: API client configuration and generated schemas.
- `src/components/ui`: Reusable UI components (shadcn-vue). Do not modify these manually if possible; update via CLI or copy-paste from documentation.
- `src/views`: Page-level components.
- `src/lib`: Utility functions (`utils.ts`) and library configurations.
- `src/assets`: Static assets and global styles (`main.css`).

### Aliases

- `@/` -> `src/` (e.g., `import Button from '@/components/ui/button/Button.vue'`)

### Coding Conventions

- **Styling:** Use Tailwind CSS utility classes. Avoid custom CSS when possible.
- **Components:** Use PascalCase for component filenames and usage (e.g., `<MyComponent />`).
- **API Interaction:** Use the generated client in `src/api/client.ts` (implied) for type-safety.
- **Store:** Use Pinia stores for global state.

## Configuration

- **Vite Config:** `vite.config.ts` handles plugins (Vue, Tailwind) and the dev server proxy.
- **Tailwind Config:** v4 configuration is largely handled via CSS imports and the `@tailwindcss/postcss` plugin.
- **Components Config:** `components.json` manages `shadcn-vue` settings.
