import type { components } from "@/api/schema";

type Persona = components["schemas"]["PersonaResponse"];

export const personas: Persona[] = [
  {
    id: "persona-1",
    name: "Default User",
    description: "A curious adventurer seeking knowledge and stories.",
    avatar_path: "https://picsum.photos/seed/persona-1/400/600",
    avatar_thumbnail_path: "https://picsum.photos/seed/persona-1/200/200",
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "persona-2",
    name: "The Scholar",
    description: "An academic researcher with a thirst for ancient lore and forgotten histories.",
    avatar_path: "https://picsum.photos/seed/persona-2/400/600",
    avatar_thumbnail_path: "https://picsum.photos/seed/persona-2/200/200",
    is_default: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "persona-3",
    name: "The Wanderer",
    description: "A mysterious traveler from distant lands, carrying tales of far-off places.",
    avatar_path: "https://picsum.photos/seed/persona-3/400/600",
    avatar_thumbnail_path: "https://picsum.photos/seed/persona-3/200/200",
    is_default: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
