import type { components } from "@/api/schema";

type Persona = components["schemas"]["PersonaResponse"];

export const personas: Persona[] = [
  {
    id: "persona-1",
    name: "Default User",
    description: "A curious adventurer seeking knowledge and stories.",
    avatar_path: null,
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "persona-2",
    name: "The Scholar",
    description: "An academic researcher with a thirst for ancient lore and forgotten histories.",
    avatar_path: null,
    is_default: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "persona-3",
    name: "The Wanderer",
    description: "A mysterious traveler from distant lands, carrying tales of far-off places.",
    avatar_path: null,
    is_default: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
