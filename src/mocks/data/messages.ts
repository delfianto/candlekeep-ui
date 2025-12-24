// src/mocks/data/messages.ts
import type { components } from "@/api/schema";
import { loadConversation, type YamlScenario } from "../loader";

// Import YAML files
import aranwenData from "./scenarios/aranwen.yaml";
import lynaraData from "./scenarios/lynara.yaml";
import zahrashaData from "./scenarios/zahrasha.yaml";
import eloiseData from "./scenarios/eloise.yaml";

type Message = components["schemas"]["MessageResponse"];

// Map the Chat IDs (from chats.ts) to the loaded YAML data
export const messages: Record<string, Message[]> = {
  "chat-aranwen-01": loadConversation("chat-aranwen-01", aranwenData as YamlScenario, 12),
  "chat-lynara-01": loadConversation("chat-lynara-01", lynaraData as YamlScenario, 8),
  "chat-zahrasha-01": loadConversation("chat-zahrasha-01", zahrashaData as YamlScenario, 15),
  "chat-eloise-01": loadConversation("chat-eloise-01", eloiseData as YamlScenario, 5),
};
