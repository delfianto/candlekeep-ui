Here is the step-by-step plan to migrate your mock data system.

I have designed this plan to work seamlessly with your existing `Bun` + `Vite` setup and to solve the issue of linking Chat IDs to Message IDs deterministically.

````markdown
# MIGRATION_PLAN.md

## Overview

This plan transitions the mock message data from hardcoded TypeScript objects to a scalable YAML-based system. This allows for writing extensive RP dialogues in a natural format while automatically handling timestamps and ID generation.

## Phase 1: Infrastructure & Dependencies

### 1. Install Vite YAML Plugin

We need a Vite plugin to import `.yaml` files as native JavaScript objects.

Run this command:

```bash
bun add -d @modyfi/vite-plugin-yaml
```
````

### 2. Configure Vite

Update `vite.config.ts` to handle YAML imports.

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ViteYaml from "@modyfi/vite-plugin-yaml"; // Add this

export default defineConfig({
    plugins: [
        vue(),
        ViteYaml(), // Add this to plugins array
    ],
    resolve: {
        alias: {
            "@": "/src",
        },
    },
    // ... rest of config
});
```

### 3. Add TypeScript Definitions

To prevent TypeScript errors when importing YAML files, create or update a declaration file.

Create `src/types/yaml.d.ts`:

```typescript
declare module "*.yaml" {
    const data: any;
    export default data;
}

declare module "*.yml" {
    const data: any;
    export default data;
}
```

---

## Phase 2: Utility Updates

### 4. Create the Message Loader

Create `src/mocks/loader.ts`. This utility converts the static YAML content into the dynamic `MessageResponse` format required by your API types.

```typescript
// src/mocks/loader.ts
import { dateMock, idMock } from "./utils";
import type { components } from "@/api/schema";

type Message = components["schemas"]["MessageResponse"];

// Interface matching the YAML structure
export interface YamlScenario {
    messages: Array<{
        role: "user" | "assistant";
        content: string;
    }>;
}

/**
 * Hydrates a raw YAML conversation with IDs and Timestamps
 * @param chatId - The ID of the chat this conversation belongs to
 * @param data - The raw data imported from YAML
 * @param daysAgoStart - How many days ago the conversation started
 */
export function loadConversation(
    chatId: string,
    data: YamlScenario,
    daysAgoStart: number = 7,
): Message[] {
    const timestamps = dateMock.chatMessageTimestamps(
        daysAgoStart,
        data.messages.length,
    );

    return data.messages.map((msg, index) => ({
        id: idMock.generateMessageId(chatId, index),
        chat_id: chatId,
        role: msg.role,
        content: msg.content.trim(),
        created_at: timestamps[index],
    }));
}
```

---

## Phase 3: Data Stabilization & Migration

### 5. Stabilize Chat IDs

Your current `chats.ts` uses random IDs (`idMock.generateChatId`). This makes it impossible to link a YAML file to a Chat reliably. We need to assign **Static IDs** to your seed chats.

Update `src/mocks/data/chats.ts` (Example for the first few entries):

```typescript
// src/mocks/data/chats.ts
import type { components } from "@/api/schema";
import { dateMock } from "../utils"; // Updated import path

type Chat = components["schemas"]["ChatResponse"];

export const chats: Chat[] = [
    // Aranwen - Use a static ID string
    {
        id: "chat-aranwen-01",
        character_id: "7384-aranwen-the-banished",
        model_id: "gpt-4o",
        title: "Divine Mechanism and Doubt",
        ...dateMock.datePair(12, 1),
    },
    // Lynara
    {
        id: "chat-lynara-01",
        character_id: "2910-lynara-frost-scholar",
        model_id: "claude-4-5-sonnet",
        title: "Secrets of Saarthal's Ice",
        ...dateMock.datePair(8, 2),
    },
    // ... update the rest with IDs like 'chat-zahrasha-01', etc.
];
```

### 6. Create Scenario Files

Create the directory: `src/mocks/data/scenarios/`.
Create a YAML file for each chat you defined in Step 5.

**`src/mocks/data/scenarios/aranwen.yaml`**

```yaml
messages:
    - role: assistant
      content: |
          The gears of fate turn ever forward, outlander. I am Aranwen, once of the Clockwork City. 
          My hands still remember the touch of blessed brass.
    - role: user
      content: |
          I'm interested in why you were banished. You mentioned "questioning the divinity."
    - role: assistant
      content: |
          A dangerous question. Sotha Sil teaches that the world is a machine, perfect in its function. 
          But if the machine is perfect, why do we suffer?
```

**`src/mocks/data/scenarios/lynara.yaml`**

```yaml
messages:
    - role: assistant
      content: |
          Oh! A visitor! Welcome to the Winterhold Mages Guild - well, what's left of it anyway.
          I'm Lynara. I've been studying a fascinating correlation between aetherial resonance and ice.
    - role: user
      content: |
          Tell me more about this ice resonance.
    - role: assistant
      content: |
          It's quite simple really! Well, theoretically simple. When frost magic interacts with ancient Nordic carvings...
```

---

## Phase 4: Integration

### 7. Update Messages Registry

Update `src/mocks/data/messages.ts` to import the YAML files and map them to the Chat IDs.

```typescript
// src/mocks/data/messages.ts
import type { components } from "@/api/schema";
import { loadConversation, type YamlScenario } from "../loader";

// Import YAML files
import aranwenData from "./scenarios/aranwen.yaml";
import lynaraData from "./scenarios/lynara.yaml";

type Message = components["schemas"]["MessageResponse"];

// Map the Chat IDs (from chats.ts) to the loaded YAML data
export const messages: Record<string, Message[]> = {
    "chat-aranwen-01": loadConversation(
        "chat-aranwen-01",
        aranwenData as YamlScenario,
        12,
    ),
    "chat-lynara-01": loadConversation(
        "chat-lynara-01",
        lynaraData as YamlScenario,
        8,
    ),
    // Add other mappings here...
};
```

### 8. Verify

Run your dev server:

```bash
bun run dev
```

1. Open the UI.
2. Select the "Aranwen" chat.
3. Ensure the messages appear, are formatted correctly, and have valid timestamps sorted chronologically.
