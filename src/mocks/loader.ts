import { dateMock, idMock } from "./utils";
import type { components } from "@/api/schema";

type Message = components["schemas"]["MessageResponse"];

interface RawConversation {
  id: string; // The chat ID
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

export function loadConversation(data: RawConversation, daysAgoStart: number = 7): Message[] {
  const timestamps = dateMock.chatMessageTimestamps(daysAgoStart, data.messages.length);

  return data.messages.map((msg, index) => ({
    id: idMock.generateMessageId(data.id, index),
    chat_id: data.id,
    role: msg.role,
    content: msg.content.trim(),
    created_at: timestamps[index],
  }));
}
