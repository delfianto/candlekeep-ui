import type { components } from "@/api/schema";

type Provider = components["schemas"]["ProviderResponse"];

export const llmProviders: Provider[] = [
  {
    id: "provider-1",
    provider_type: "google",
    name: "Google Gemini",
    base_url: null,
    enabled: true,
    api_key_configured: true,
    env_var_name: "GOOGLE_API_KEY",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "provider-2",
    provider_type: "anthropic",
    name: "Anthropic Claude",
    base_url: null,
    enabled: true,
    api_key_configured: false,
    env_var_name: "ANTHROPIC_API_KEY",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "provider-3",
    provider_type: "openai",
    name: "OpenAI GPT",
    base_url: null,
    enabled: true,
    api_key_configured: true,
    env_var_name: "OPENAI_API_KEY",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "provider-4",
    provider_type: "ollama",
    name: "Ollama Local",
    base_url: "http://localhost:11434",
    enabled: true,
    api_key_configured: true,
    env_var_name: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
