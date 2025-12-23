export const modelFamiliesParameterDocs = {
  "temperature": {
    "label": "Temperature (Creativity)",
    "short_info": "Controls how predictable or wild the character's responses are.",
    "detailed_info": "Determines how 'safe' the AI plays it. Low values (0.5-0.7) make characters consistent, logical, and sticky to their definitions, but potentially boring. High values (0.9-1.2) allow for creative phrasing, unexpected plot twists, and emotional volatility, but risk incoherence. For ERP/RP, slightly higher (1.0-1.1) is often preferred to keep the interaction dynamic."
  },
  "top_p": {
    "label": "Top P (Nucleus Sampling)",
    "short_info": "Filters out unlikely words. Determines vocabulary breadth.",
    "detailed_info": "Acts as a sanity filter. A value of 0.9 means the AI only considers the top 90% of likely words. lowering this helps if the character starts speaking gibberish or using made-up words at high temperatures. Leave at 1.0 if you want the full range of the model's vocabulary."
  },
  "top_k": {
    "label": "Top K",
    "short_info": "Hard limit on vocabulary choices. Stabilizes output.",
    "detailed_info": "Strictly limits the AI to choosing from the top K best words. Useful for Anime-style or smaller models to prevent them from 'breaking' or going off-track. For modern models (Claude/Gemini), higher values (40-100) allow for more literary flair and rare descriptors."
  },
  "seed": {
    "label": "RNG Seed",
    "short_info": "Force the exact same response for the same prompt.",
    "detailed_info": "If set, the AI will generate the exact same response every time (assuming other settings match). Useful for testing prompt changes or debugging a broken character card."
  },
  "frequency_penalty": {
    "label": "Frequency Penalty (Repetition)",
    "short_info": "Punishes words that have been used many times.",
    "detailed_info": "Prevents the character from getting stuck in loops (e.g., saying 'smirks' or 'chuckles' every sentence). Turn this up if the character sounds like a broken record. Too high, and the grammar may break as it runs out of common words like 'the' or 'a'."
  },
  "presence_penalty": {
    "label": "Presence Penalty (Variety)",
    "short_info": "Punishes words that have appeared at least once.",
    "detailed_info": "Encourages the model to introduce NEW topics and words rather than dwelling on the current scene. Useful if the RP feels stagnant and you want the character to push the plot forward."
  },
  "max_completion_tokens": {
    "label": "Max Response Length",
    "short_info": "Hard limit on how much the character can write.",
    "detailed_info": "The maximum text generation allowed. Lower this if you want snappy dialogue or short emotes. Raise this for slow-burn, novella-style responses. (Note: This matches OpenAI's 'max_completion_tokens')."
  },
  "max_tokens": {
    "label": "Max Response Length",
    "short_info": "Hard limit on how much the character can write.",
    "detailed_info": "The maximum text generation allowed. Set higher for 'Purple Prose' or detailed scene descriptions. (Matches Anthropic's naming convention)."
  },
  "max_output_tokens": {
    "label": "Max Response Length",
    "short_info": "Hard limit on how much the character can write.",
    "detailed_info": "The maximum text generation allowed. (Matches Google's naming convention)."
  },
  "stop": {
    "label": "Stop Sequences",
    "short_info": "Keywords that force the AI to stop typing immediately.",
    "detailed_info": "Crucial for RP to prevent the AI from impersonating YOU. Common settings include your username, 'User:', or '\n\n'. Tells the model: 'You are done, now it is my turn'."
  },
  "stop_sequences": {
    "label": "Stop Sequences",
    "short_info": "Keywords that force the AI to stop typing immediately.",
    "detailed_info": "Same as 'Stop', used by Anthropic/Google models."
  },
  "reasoning_effort": {
    "label": "Reasoning Effort (O1/GPT-5)",
    "short_info": "How hard the model thinks about the scenario context.",
    "detailed_info": "Controls the depth of the internal thought chain. 'High' is useful for complex lore checks, solving riddles, or political intrigue RPs where keeping facts straight is critical. 'Low' is faster and better for casual chat."
  },
  "thinking": {
    "label": "Thinking Budget (Claude)",
    "short_info": "Enable internal monologue before speaking.",
    "detailed_info": "Allows the character to 'think' silently before replying. Incredible for RP: the character can plan lies, weigh emotional reactions, or recall obscure lore without polluting the chat log. Set a budget (e.g., 2000 tokens) to give them space to ponder."
  },
  "logit_bias": {
    "label": "Logit Bias (Banned/Forced Words)",
    "short_info": "Manually ban or force specific words.",
    "detailed_info": "Advanced: Allows you to mathematically prevent the model from using certain words (e.g., modern slang in a fantasy RP) or drastically increase the chance of specific formatting."
  },
  "system": {
    "label": "System Prompt Override",
    "short_info": "The core instructions defining the world and character.",
    "detailed_info": "Usually handled automatically by your Character Card. Overrides the base instructions. Use this to enforce global rules like 'Write in third person past tense' or 'NSFW allowed'."
  },
  "developer_message": {
    "label": "Developer Message (O1/GPT-5)",
    "short_info": "The foundational rules for reasoning models.",
    "detailed_info": "Similar to System Prompt, but treated with higher priority by O1/GPT-5 class models. Use this for strict jailbreaks or absolute formatting rules."
  },
  "safety_settings": {
    "label": "Safety Filters",
    "short_info": "Content filtering sensitivity.",
    "detailed_info": "Controls how aggressive the provider is about blocking NSFW or violent content. For RP, this usually needs to be minimized or disabled if possible."
  },
  "response_format": {
    "label": "Response Format",
    "short_info": "Force JSON or Text structure.",
    "detailed_info": "Usually not used for chat, but can force the model to output structured data for game mechanics (e.g. inventory updates)."
  },
  "n": {
    "label": "N (Generations)",
    "short_info": "Generate multiple responses at once.",
    "detailed_info": "Create multiple drafts for the same message so you can pick the best one. Increases cost/time."
  },
  "stream": {
    "label": "Stream Response",
    "short_info": "Typewriter effect.",
    "detailed_info": "If enabled, you see the text appearing as it is written. If disabled, you wait until the whole message is done."
  }
};
