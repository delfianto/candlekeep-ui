import type { components } from "@/api/schema";

type ModelFamily = components["schemas"]["ModelFamilyResponse"];

const NOW = new Date().toISOString();

export const modelFamilies: ModelFamily[] = [
  {
    id: "mf_gpt-4o",
    name: "GPT-4o",
    provider_types: ["openai"],
    description: "OpenAI's most advanced multimodal model family.",
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "mf_gpt-5.1",
    name: "GPT-5.1",
    provider_types: ["openai"],
    description: "Next-generation reasoning models from OpenAI.",
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "mf_claude_sonnet",
    name: "Claude Sonnet",
    provider_types: ["anthropic"],
    description: "Anthropic's balanced model family for speed and intelligence.",
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "mf_gemini-2.5",
    name: "Gemini 2.5",
    provider_types: ["google"],
    description: "Google's high-speed multimodal models.",
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "mf_gemini-3.0",
    name: "Gemini 3.0",
    provider_types: ["google"],
    description: "Experimental next-gen models from Google.",
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "mf_grok",
    name: "Grok",
    provider_types: ["xai"],
    description: "xAI's Grok model family.",
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "mf_local_ollama",
    name: "Ollama Local",
    provider_types: ["ollama"],
    description: "Locally hosted models via Ollama.",
    created_at: NOW,
    updated_at: NOW,
  },
];
