import type { components } from "@/api/schema";

type ModelFamilyPage = components["schemas"]["PaginatedResponse_ModelFamilyResponse_"];

const NOW = new Date().toISOString();

export const modelFamiliesPages: ModelFamilyPage[] = [
  // Page 1
  {
    items: [
      {
        name: "OpenAI GPT-4.1 / 4o Chat",
        family_identifier: "openai/gpt-4",
        description:
          "OpenAI GPT-4.1 / GPT-4o chat models. High-speed multimodal chat with classic sampling controls.",
        provider_types: ["openai", "openrouter"],
        parameters: {
          max_completion_tokens: { type: "int", default: 2048, min_value: 1, max_value: 32768 },
          temperature: { type: "float", default: 1.0, min_value: 0.0, max_value: 2.0 },
          top_p: { type: "float", default: 1.0, min_value: 0.0, max_value: 1.0 },
          stop: { type: "list", item_schema: { type: "string" } },
          stream: { type: "boolean", default: true },
          response_format: { type: "object" },
          frequency_penalty: { type: "float", default: 0.0, min_value: -2.0, max_value: 2.0 },
          presence_penalty: { type: "float", default: 0.0, min_value: -2.0, max_value: 2.0 },
        },
        unsupported_parameters: ["max_tokens", "reasoning_effort", "summary", "verbosity"],
        extra_metadata: {
          context_window: 128000,
          supports_vision: true,
          supports_function_calling: true,
          models: ["gpt-4.1", "gpt-4.1-mini", "gpt-4o", "gpt-4o-mini"],
        },
        id: "openai-gpt-4",
        created_at: NOW,
        updated_at: NOW,
      },
      {
        name: "OpenAI GPT-5 Thinking",
        family_identifier: "openai/gpt-5-thinking",
        description:
          "OpenAI GPT-5 reasoning models. Deep reasoning, no classic sampling, uses reasoning.effort.",
        provider_types: ["openai", "openrouter"],
        parameters: {
          max_completion_tokens: { type: "int", default: 2048, min_value: 1, max_value: 32768 },
          reasoning_effort: {
            type: "enum",
            default: "medium",
            str_values: ["minimal", "low", "medium", "high"],
          },
          summary: { type: "enum", default: "auto", str_values: ["concise", "detailed", "auto"] },
          verbosity: { type: "enum", default: "medium", str_values: ["low", "medium", "high"] },
          stop: { type: "list", item_schema: { type: "string" } },
          stream: { type: "boolean", default: true },
          response_format: { type: "object" },
        },
        unsupported_parameters: [
          "max_tokens",
          "temperature",
          "top_p",
          "frequency_penalty",
          "presence_penalty",
        ],
        extra_metadata: {
          context_window: 200000,
          supports_vision: true,
          supports_function_calling: true,
          models: ["gpt-5", "gpt-5-mini", "gpt-5-nano"],
        },
        id: "openai-gpt-5-thinking",
        created_at: NOW,
        updated_at: NOW,
      },
      {
        name: "OpenAI GPT-5.1 Thinking",
        family_identifier: "openai/gpt-5.1-thinking",
        description: "OpenAI GPT-5.1 reasoning model.",
        provider_types: ["openai", "openrouter"],
        parameters: {
          max_completion_tokens: { type: "int", default: 2048, min_value: 1, max_value: 32768 },
          reasoning_effort: {
            type: "enum",
            default: "medium",
            str_values: ["none", "low", "medium", "high"],
          },
          summary: { type: "enum", default: "auto", str_values: ["concise", "detailed", "auto"] },
          verbosity: { type: "enum", default: "medium", str_values: ["low", "medium", "high"] },
          stop: { type: "list", item_schema: { type: "string" } },
          stream: { type: "boolean", default: true },
          response_format: { type: "object" },
        },
        unsupported_parameters: [
          "max_tokens",
          "temperature",
          "top_p",
          "frequency_penalty",
          "presence_penalty",
        ],
        extra_metadata: {
          context_window: 200000,
          supports_vision: true,
          supports_function_calling: true,
          models: ["gpt-5.1"],
        },
        id: "openai-gpt-5-1-thinking",
        created_at: NOW,
        updated_at: NOW,
      },
      {
        name: "OpenAI GPT-5.2 Thinking",
        family_identifier: "openai/gpt-5.2-thinking",
        description: "OpenAI GPT-5.2 reasoning model with extended effort levels.",
        provider_types: ["openai", "openrouter"],
        parameters: {
          max_completion_tokens: { type: "int", default: 2048, min_value: 1, max_value: 32768 },
          reasoning_effort: {
            type: "enum",
            default: "medium",
            str_values: ["none", "low", "medium", "high", "xhigh"],
          },
          summary: { type: "enum", default: "auto", str_values: ["concise", "detailed", "auto"] },
          verbosity: { type: "enum", default: "medium", str_values: ["low", "medium", "high"] },
          stop: { type: "list", item_schema: { type: "string" } },
          stream: { type: "boolean", default: true },
          response_format: { type: "object" },
        },
        unsupported_parameters: [
          "max_tokens",
          "temperature",
          "top_p",
          "frequency_penalty",
          "presence_penalty",
        ],
        extra_metadata: {
          context_window: 200000,
          supports_vision: true,
          supports_function_calling: true,
          models: ["gpt-5.2"],
        },
        id: "openai-gpt-5-2-thinking",
        created_at: NOW,
        updated_at: NOW,
      },
      {
        name: "OpenAI GPT-5 Chat",
        family_identifier: "openai/gpt-5-chat",
        description: "OpenAI GPT-5 chat model. Standard sampling, no reasoning.effort.",
        provider_types: ["openai", "openrouter"],
        parameters: {
          max_completion_tokens: { type: "int", default: 2048, min_value: 1, max_value: 16384 },
          temperature: { type: "float", default: 1.0, min_value: 0.0, max_value: 2.0 },
          top_p: { type: "float", default: 1.0, min_value: 0.0, max_value: 1.0 },
          stop: { type: "list", item_schema: { type: "string" } },
          stream: { type: "boolean", default: true },
          response_format: { type: "object" },
          frequency_penalty: { type: "float", default: 0.0, min_value: -2.0, max_value: 2.0 },
          presence_penalty: { type: "float", default: 0.0, min_value: -2.0, max_value: 2.0 },
        },
        unsupported_parameters: ["reasoning_effort", "summary", "verbosity", "max_tokens"],
        extra_metadata: {
          context_window: 128000,
          supports_vision: false,
          supports_function_calling: false,
          models: ["gpt-5-chat-latest"],
        },
        id: "openai-gpt-5-chat",
        created_at: NOW,
        updated_at: NOW,
      },
      {
        name: "OpenAI GPT-5.x Chat",
        family_identifier: "openai/gpt-5.x-chat",
        description: "OpenAI GPT-5.1/5.2 chat models with summary controls.",
        provider_types: ["openai", "openrouter"],
        parameters: {
          max_completion_tokens: { type: "int", default: 2048, min_value: 1, max_value: 16384 },
          temperature: { type: "float", default: 1.0, min_value: 0.0, max_value: 2.0 },
          top_p: { type: "float", default: 1.0, min_value: 0.0, max_value: 1.0 },
          summary: { type: "enum", default: "auto", str_values: ["concise", "detailed", "auto"] },
          stop: { type: "list", item_schema: { type: "string" } },
          stream: { type: "boolean", default: true },
          response_format: { type: "object" },
          frequency_penalty: { type: "float", default: 0.0, min_value: -2.0, max_value: 2.0 },
          presence_penalty: { type: "float", default: 0.0, min_value: -2.0, max_value: 2.0 },
        },
        unsupported_parameters: ["reasoning_effort", "verbosity", "max_tokens"],
        extra_metadata: {
          context_window: 128000,
          supports_vision: false,
          supports_function_calling: false,
          models: ["gpt-5.1-chat-latest", "gpt-5.2-chat-latest"],
        },
        id: "openai-gpt-5-x-chat",
        created_at: NOW,
        updated_at: NOW,
      },
      {
        name: "Claude 4.5 Standard",
        family_identifier: "anthropic/claude-4.5-standard",
        description: "Anthropic Claude 4.5 Haiku & Sonnet. Balanced speed/intelligence for RP.",
        provider_types: ["anthropic", "openrouter"],
        parameters: {
          max_tokens: { type: "int", default: 4096, min_value: 1, max_value: 16384 },
          temperature: { type: "float", default: 1.0, min_value: 0.0, max_value: 2.0 },
          top_p: { type: "float", default: 1.0, min_value: 0.0, max_value: 1.0 },
          top_k: { type: "int", default: 40, min_value: 1, max_value: 500 },
          stop_sequences: { type: "list", item_schema: { type: "string" } },
          stream: { type: "boolean", default: true },
          system: { type: "string" },
          thinking: {
            type: "object",
            properties: {
              type: { type: "enum", str_values: ["enabled", "disabled"] },
              budget_tokens: { type: "int", min_value: 1024, max_value: 20000 },
            },
          },
        },
        unsupported_parameters: [],
        extra_metadata: {
          context_window: 500000,
          supports_vision: true,
          supports_function_calling: true,
          models: ["claude-4.5-haiku", "claude-4.5-sonnet"],
        },
        id: "anthropic-claude-4-5-standard",
        created_at: NOW,
        updated_at: NOW,
      },
      {
        name: "DeepSeek V3",
        family_identifier: "openrouter/deepseek-v3",
        description: "DeepSeek V3 reasoning and chat model with strong performance",
        provider_types: ["openrouter"],
        parameters: {
          max_tokens: { type: "int", default: 4096, min_value: 1, max_value: 16384 },
          temperature: { type: "float", default: 0.7, min_value: 0.0, max_value: 1.5 },
        },
        unsupported_parameters: [],
        extra_metadata: {
          context_window: 64000,
          supports_vision: false,
          supports_function_calling: true,
        },
        id: "openrouter-deepseek-v3",
        created_at: NOW,
        updated_at: NOW,
      },
      {
        name: "Claude 4.5 Opus",
        family_identifier: "anthropic/claude-4.5-opus",
        description: "Anthropic Claude 4.5 Opus. High-cost, high-fidelity model.",
        provider_types: ["anthropic", "openrouter"],
        parameters: {
          max_tokens: { type: "int", default: 4096, min_value: 1, max_value: 32768 },
          temperature: { type: "float", default: 1.0, min_value: 0.0, max_value: 2.0 },
          top_p: { type: "float", default: 1.0, min_value: 0.0, max_value: 1.0 },
          top_k: { type: "int", default: 40, min_value: 1 },
          stop_sequences: { type: "list", item_schema: { type: "string" } },
          stream: { type: "boolean", default: true },
          system: { type: "string" },
          thinking: {
            type: "object",
            properties: {
              type: { type: "enum", str_values: ["enabled", "disabled"] },
              budget_tokens: { type: "int", min_value: 1024, max_value: 32000 },
            },
          },
          metadata: { type: "object" },
        },
        unsupported_parameters: [],
        extra_metadata: {
          context_window: 1000000,
          supports_vision: true,
          supports_function_calling: true,
          models: ["claude-4.5-opus"],
        },
        id: "anthropic-claude-4-5-opus",
        created_at: NOW,
        updated_at: NOW,
      },
      {
        name: "Gemini 2.5 Text",
        family_identifier: "google/gemini-2.5-text",
        description: "Google Gemini 2.5 Flash & Pro. High-context, general-purpose textgen.",
        provider_types: ["google", "openrouter"],
        parameters: {
          max_output_tokens: { type: "int", default: 2048, min_value: 1, max_value: 16384 },
          temperature: { type: "float", default: 1.0, min_value: 0.0, max_value: 2.0 },
          top_p: { type: "float", default: 0.95, min_value: 0.0, max_value: 1.0 },
          top_k: { type: "int", default: 40, min_value: 1 },
          stop_sequences: { type: "list", item_schema: { type: "string" } },
          frequency_penalty: { type: "float", default: 0.0, min_value: -2.0, max_value: 2.0 },
          presence_penalty: { type: "float", default: 0.0, min_value: -2.0, max_value: 2.0 },
          safety_settings: {
            type: "list",
            default: [
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            ],
            item_schema: {
              type: "object",
              properties: {
                category: {
                  type: "enum",
                  str_values: [
                    "HARM_CATEGORY_HARASSMENT",
                    "HARM_CATEGORY_HATE_SPEECH",
                    "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "HARM_CATEGORY_DANGEROUS_CONTENT",
                  ],
                },
                threshold: {
                  type: "enum",
                  default: "BLOCK_NONE",
                  str_values: [
                    "BLOCK_NONE",
                    "BLOCK_LOW_AND_ABOVE",
                    "BLOCK_MEDIUM_AND_ABOVE",
                    "BLOCK_HIGH_AND_ABOVE",
                  ],
                },
              },
            },
          },
        },
        unsupported_parameters: [],
        extra_metadata: {
          context_window: 2000000,
          supports_vision: true,
          supports_function_calling: true,
          models: ["gemini-2.5-flash", "gemini-2.5-pro"],
        },
        id: "google-gemini-2-5-text",
        created_at: NOW,
        updated_at: NOW,
      },
    ],
    total_items: 22,
    current_page: 1,
    limit: 10,
    has_next_page: true,
    has_previous_page: false,
    next_page: 2,
    previous_page: null,
  },

  // Page 2
  {
    items: [
      {
        name: "Gemini 3.0 Text",
        family_identifier: "google/gemini-3.0-text",
        description: "Google Gemini 3 Flash & Pro. Adds thinking_level controls.",
        provider_types: ["google", "openrouter"],
        parameters: {
          max_output_tokens: { type: "int", default: 2048, min_value: 1, max_value: 16384 },
          temperature: { type: "float", default: 1.0, min_value: 0.0, max_value: 2.0 },
          top_p: { type: "float", default: 0.95, min_value: 0.0, max_value: 1.0 },
          top_k: { type: "int", default: 40, min_value: 1 },
          stop_sequences: { type: "list", item_schema: { type: "string" } },
          frequency_penalty: { type: "float", default: 0.0, min_value: -2.0, max_value: 2.0 },
          presence_penalty: { type: "float", default: 0.0, min_value: -2.0, max_value: 2.0 },
          safety_settings: {
            type: "list",
            default: [
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            ],
            item_schema: {
              type: "object",
              properties: {
                category: {
                  type: "enum",
                  str_values: [
                    "HARM_CATEGORY_HARASSMENT",
                    "HARM_CATEGORY_HATE_SPEECH",
                    "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "HARM_CATEGORY_DANGEROUS_CONTENT",
                  ],
                },
                threshold: {
                  type: "enum",
                  default: "BLOCK_NONE",
                  str_values: [
                    "BLOCK_NONE",
                    "BLOCK_LOW_AND_ABOVE",
                    "BLOCK_MEDIUM_AND_ABOVE",
                    "BLOCK_HIGH_AND_ABOVE",
                  ],
                },
              },
            },
          },
          thinking_level: {
            type: "enum",
            default: "minimal",
            str_values: ["minimal", "low", "medium", "high"],
          },
        },
        unsupported_parameters: [],
        extra_metadata: {
          context_window: 2000000,
          supports_vision: true,
          supports_function_calling: true,
          models: ["gemini-3-flash", "gemini-3-pro"],
        },
        id: "google-gemini-3-0-text",
        created_at: NOW,
        updated_at: NOW,
      },
      {
        name: "xAI Grok 4",
        family_identifier: "xai/grok-4",
        description:
          "xAI Grok 4 reasoning model. Always uses reasoning mode with no toggle. Does not support stop sequences or penalties. 256K context window.",
        provider_types: ["xai", "openrouter"],
        parameters: {
          max_tokens: { type: "int", default: 2048, min_value: 1, max_value: 256000 },
          temperature: { type: "float", default: 1.0, min_value: 0.0, max_value: 2.0 },
          top_p: { type: "float", default: 1.0, min_value: 0.0, max_value: 1.0 },
          stream: { type: "boolean", default: true },
        },
        unsupported_parameters: [
          "stop",
          "frequency_penalty",
          "presence_penalty",
          "reasoning_effort",
        ],
        extra_metadata: {
          context_window: 256000,
          supports_vision: false,
          supports_function_calling: true,
          models: ["grok-4-0709", "grok-4"],
          notes: "Reasoning always active. No penalty/stop support.",
        },
        id: "xai-grok-4",
        created_at: NOW,
        updated_at: NOW,
      },
      {
        name: "xAI Grok 4.1",
        family_identifier: "xai/grok-4.1",
        description:
          "xAI Grok 4.1 with improved conversational quality, emotional intelligence, and creative writing. 3x lower hallucination rate. Ideal for RP scenarios.",
        provider_types: ["xai", "openrouter"],
        parameters: {
          max_tokens: { type: "int", default: 2048, min_value: 1, max_value: 128000 },
          temperature: { type: "float", default: 1.0, min_value: 0.0, max_value: 2.0 },
          top_p: { type: "float", default: 1.0, min_value: 0.0, max_value: 1.0 },
          stream: { type: "boolean", default: true },
        },
        unsupported_parameters: [
          "stop",
          "frequency_penalty",
          "presence_penalty",
          "reasoning_effort",
        ],
        extra_metadata: {
          context_window: 128000,
          supports_vision: false,
          supports_function_calling: true,
          models: ["grok-4.1-2025-11-17", "grok-4.1"],
          notes:
            "Enhanced emotional intelligence and creative expression. Best for character-driven RP.",
        },
        id: "xai-grok-4-1",
        created_at: NOW,
        updated_at: NOW,
      },
      {
        name: "xAI Grok 4.1 Fast",
        family_identifier: "xai/grok-4.1-fast",
        description:
          "xAI Grok 4.1 Fast with massive 2M token context window. Ultra-fast responses with best-in-class tool calling. Perfect for long-form RP sessions.",
        provider_types: ["xai", "openrouter"],
        parameters: {
          max_tokens: { type: "int", default: 4096, min_value: 1, max_value: 2000000 },
          temperature: { type: "float", default: 1.0, min_value: 0.0, max_value: 2.0 },
          top_p: { type: "float", default: 1.0, min_value: 0.0, max_value: 1.0 },
          stream: { type: "boolean", default: true },
        },
        unsupported_parameters: [
          "stop",
          "frequency_penalty",
          "presence_penalty",
          "reasoning_effort",
        ],
        extra_metadata: {
          context_window: 2000000,
          supports_vision: false,
          supports_function_calling: true,
          models: ["grok-4.1-fast"],
          notes:
            "2M context enables entire novel-length RP sessions. Fastest Grok variant with superior tool calling.",
        },
        id: "xai-grok-4-1-fast",
        created_at: NOW,
        updated_at: NOW,
      },
      {
        name: "Llama 3 RP",
        family_identifier: "openrouter/llama-3-rp",
        description: "Llama 3 70B models optimized for creative roleplay scenarios",
        provider_types: ["openrouter"],
        parameters: {
          max_tokens: { type: "int", default: 4096, min_value: 1, max_value: 32768 },
          temperature: { type: "float", default: 0.8, min_value: 0.0, max_value: 2.0 },
          top_p: { type: "float", default: 0.9, min_value: 0.0, max_value: 1.0 },
        },
        unsupported_parameters: [],
        extra_metadata: {
          context_window: 8192,
          supports_vision: false,
          supports_function_calling: false,
        },
        id: "openrouter-llama-3-rp",
        created_at: NOW,
        updated_at: NOW,
      },
      {
        name: "Mistral Uncensored",
        family_identifier: "openrouter/mistral-uncensored",
        description: "Uncensored Mistral-based models for creative writing and roleplay",
        provider_types: ["openrouter"],
        parameters: {
          max_tokens: { type: "int", default: 8192, min_value: 1, max_value: 32768 },
          temperature: { type: "float", default: 0.9, min_value: 0.0, max_value: 2.0 },
        },
        unsupported_parameters: [],
        extra_metadata: {
          context_window: 32768,
          supports_vision: false,
          supports_function_calling: false,
        },
        id: "openrouter-mistral-uncensored",
        created_at: NOW,
        updated_at: NOW,
      },
      {
        name: "GLM 4 General",
        family_identifier: "openrouter/glm-4",
        description: "GLM-4 family models including multimodal vision variants",
        provider_types: ["openrouter"],
        parameters: {
          max_tokens: { type: "int", default: 4096, min_value: 1, max_value: 8192 },
          temperature: { type: "float", default: 0.7, min_value: 0.0, max_value: 1.0 },
        },
        unsupported_parameters: [],
        extra_metadata: {
          context_window: 8192,
          supports_vision: true,
          supports_function_calling: false,
        },
        id: "openrouter-glm-4",
        created_at: NOW,
        updated_at: NOW,
      },
      {
        name: "Mistral General",
        family_identifier: "ollama/mistral",
        description: "Mistral quantized models (Small, Nemo, Large) for local deployment",
        provider_types: ["ollama"],
        parameters: {
          temperature: { type: "float", default: 0.8, min_value: 0.0, max_value: 2.0 },
          num_ctx: { type: "int", default: 32768, min_value: 512, max_value: 131072 },
        },
        unsupported_parameters: [],
        extra_metadata: {
          context_window: 32768,
          quantization: "Q4_K_M",
        },
        id: "ollama-mistral",
        created_at: NOW,
        updated_at: NOW,
      },
      {
        name: "Cydonia Roleplay",
        family_identifier: "ollama/cydonia-rp",
        description: "Cydonia optimized models for roleplay scenarios",
        provider_types: ["ollama"],
        parameters: {
          temperature: { type: "float", default: 0.85, min_value: 0.0, max_value: 2.0 },
          num_ctx: { type: "int", default: 8192, min_value: 512, max_value: 32768 },
        },
        unsupported_parameters: [],
        extra_metadata: {
          context_window: 8192,
          quantization: "Q4_K_M",
        },
        id: "ollama-cydonia-rp",
        created_at: NOW,
        updated_at: NOW,
      },
      {
        name: "Llama 3.1 General",
        family_identifier: "ollama/llama-3.1",
        description: "Llama 3.1 family models (8B, 70B, Instruct, Uncensored)",
        provider_types: ["ollama"],
        parameters: {
          temperature: { type: "float", default: 0.8, min_value: 0.0, max_value: 2.0 },
          num_ctx: { type: "int", default: 8192, min_value: 512, max_value: 131072 },
        },
        unsupported_parameters: [],
        extra_metadata: {
          context_window: 8192,
          quantization: "Q4_K_M",
        },
        id: "ollama-llama-3-1",
        created_at: NOW,
        updated_at: NOW,
      },
    ],
    total_items: 22,
    current_page: 2,
    limit: 10,
    has_next_page: true,
    has_previous_page: true,
    next_page: 3,
    previous_page: 1,
  },

  // Page 3
  {
    items: [
      {
        name: "Gemma 3 General",
        family_identifier: "ollama/gemma-3",
        description: "Google Gemma 3 family models for local deployment",
        provider_types: ["ollama"],
        parameters: {
          temperature: { type: "float", default: 0.7, min_value: 0.0, max_value: 2.0 },
          num_ctx: { type: "int", default: 128000, min_value: 512, max_value: 128000 },
        },
        unsupported_parameters: [],
        extra_metadata: {
          context_window: 128000,
          quantization: "Q4_K_M",
        },
        id: "ollama-gemma-3",
        created_at: NOW,
        updated_at: NOW,
      },
      {
        name: "Violet Lotus Roleplay",
        family_identifier: "ollama/violet-lotus-rp",
        description: "Violet Lotus optimized models for creative roleplay",
        provider_types: ["ollama"],
        parameters: {
          temperature: { type: "float", default: 0.85, min_value: 0.0, max_value: 2.0 },
          num_ctx: { type: "int", default: 8192, min_value: 512, max_value: 32768 },
        },
        unsupported_parameters: [],
        extra_metadata: {
          context_window: 8192,
          quantization: "Q4_K_M",
        },
        id: "ollama-violet-lotus-rp",
        created_at: NOW,
        updated_at: NOW,
      },
    ],
    total_items: 22,
    current_page: 3,
    limit: 10,
    has_next_page: false,
    has_previous_page: true,
    next_page: null,
    previous_page: 2,
  },
];

export const modelFamiliesFilteredByName: ModelFamilyPage = {
  "items": [
    {
      "name": "Claude 4.5 Standard",
      "family_identifier": "anthropic/claude-4.5-standard",
      "description": "Anthropic Claude 4.5 Haiku & Sonnet. Balanced speed/intelligence for RP.",
      "provider_types": [
        "anthropic",
        "openrouter"
      ],
      "parameters": {
        "max_tokens": {
          "type": "int",
          "default": 4096,
          "min_value": 1,
          "max_value": 16384
        },
        "temperature": {
          "type": "float",
          "default": 1.0,
          "min_value": 0.0,
          "max_value": 2.0
        },
        "top_p": {
          "type": "float",
          "default": 1.0,
          "min_value": 0.0,
          "max_value": 1.0
        },
        "top_k": {
          "type": "int",
          "default": 40,
          "min_value": 1,
          "max_value": 500
        },
        "stop_sequences": {
          "type": "list",
          "item_schema": {
            "type": "string"
          }
        },
        "stream": {
          "type": "boolean",
          "default": true
        },
        "system": {
          "type": "string"
        },
        "thinking": {
          "type": "object",
          "properties": {
            "type": {
              "type": "enum",
              "str_values": [
                "enabled",
                "disabled"
              ]
            },
            "budget_tokens": {
              "type": "int",
              "min_value": 1024,
              "max_value": 20000
            }
          }
        }
      },
      "unsupported_parameters": [],
      "extra_metadata": {
        "context_window": 500000,
        "supports_vision": true,
        "supports_function_calling": true,
        "models": [
          "claude-4.5-haiku",
          "claude-4.5-sonnet"
        ]
      },
      "id": "KqUbQPCItSVg",
      "created_at": "2025-12-23T08:19:13.639205",
      "updated_at": "2025-12-23T08:19:13.639206"
    },
    {
      "name": "Claude 4.5 Opus",
      "family_identifier": "anthropic/claude-4.5-opus",
      "description": "Anthropic Claude 4.5 Opus. High-cost, high-fidelity model.",
      "provider_types": [
        "anthropic",
        "openrouter"
      ],
      "parameters": {
        "max_tokens": {
          "type": "int",
          "default": 4096,
          "min_value": 1,
          "max_value": 32768
        },
        "temperature": {
          "type": "float",
          "default": 1.0,
          "min_value": 0.0,
          "max_value": 2.0
        },
        "top_p": {
          "type": "float",
          "default": 1.0,
          "min_value": 0.0,
          "max_value": 1.0
        },
        "top_k": {
          "type": "int",
          "default": 40,
          "min_value": 1
        },
        "stop_sequences": {
          "type": "list",
          "item_schema": {
            "type": "string"
          }
        },
        "stream": {
          "type": "boolean",
          "default": true
        },
        "system": {
          "type": "string"
        },
        "thinking": {
          "type": "object",
          "properties": {
            "type": {
              "type": "enum",
              "str_values": [
                "enabled",
                "disabled"
              ]
            },
            "budget_tokens": {
              "type": "int",
              "min_value": 1024,
              "max_value": 32000
            }
          }
        },
        "metadata": {
          "type": "object"
        }
      },
      "unsupported_parameters": [],
      "extra_metadata": {
        "context_window": 1000000,
        "supports_vision": true,
        "supports_function_calling": true,
        "models": [
          "claude-4.5-opus"
        ]
      },
      "id": "ZLIsTHMHQm2b",
      "created_at": "2025-12-23T08:19:13.639774",
      "updated_at": "2025-12-23T08:19:13.639775"
    }
  ],
  "total_items": 2,
  "current_page": 1,
  "limit": 10,
  "has_next_page": false,
  "has_previous_page": false,
  "next_page": null,
  "previous_page": null
};
