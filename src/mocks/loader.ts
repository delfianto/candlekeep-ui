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
