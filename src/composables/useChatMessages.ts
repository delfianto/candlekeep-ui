import { ref, watch } from "vue";
import type { components } from "@/api/schema";
import { client } from "@/api/client";

type Message = components["schemas"]["MessageResponse"];

interface UseChatMessagesOptions {
  pageSize?: number;
  autoLoad?: boolean;
}

export function useChatMessages(
  getChatId: () => string | null,
  options: UseChatMessagesOptions = {},
) {
  const { pageSize = 20, autoLoad = true } = options;

  const messages = ref<Message[]>([]);
  const loading = ref(false);
  const hasMore = ref(false);
  const nextCursor = ref<string | null>(null);
  const error = ref<Error | null>(null);

  const loadMessages = async (cursor?: string) => {
    const currentChatId = getChatId();
    if (!currentChatId) return;

    loading.value = true;
    error.value = null;

    try {
      const { data, error: apiError } = await client.GET("/api/chats/{chat_id}/messages", {
        params: {
          path: { chat_id: currentChatId },
          query: {
            limit: pageSize,
            cursor: cursor || undefined,
          },
        },
      });

      if (apiError) {
        throw new Error(`Failed to load messages: ${JSON.stringify(apiError)}`);
      }

      if (data) {
        const newMessages: Message[] = Array.isArray(data) ? data : data.items;
        const meta = Array.isArray(data) ? null : data.meta;

        // The API returns Newest -> Oldest.
        // batch = [Latest_in_batch, ..., Oldest_in_batch]

        if (meta) {
          hasMore.value = meta.has_more;
          nextCursor.value = meta.cursor || null;
        } else {
          hasMore.value = newMessages.length >= pageSize;
          nextCursor.value = hasMore.value ? newMessages[newMessages.length - 1].created_at : null;
        }

        // We want to display Oldest -> Newest in the UI state.
        // [Oldest_in_batch, ..., Latest_in_batch]
        const sortedBatch = [...newMessages].reverse();

        if (cursor) {
          messages.value = [...sortedBatch, ...messages.value];
        } else {
          messages.value = sortedBatch;
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error("Unknown error");
      console.error("Error loading messages:", err);
    } finally {
      loading.value = false;
    }
  };

  const loadMore = async () => {
    if (hasMore.value && !loading.value && nextCursor.value) {
      await loadMessages(nextCursor.value);
    }
  };

  const refresh = () => {
    messages.value = [];
    hasMore.value = false;
    nextCursor.value = null;
    loadMessages();
  };

  const sendMessage = async (content: string) => {
    const currentChatId = getChatId();
    if (!currentChatId) return;

    // Optimistic Update (User Message)
    const tempUserMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: content,
      created_at: new Date().toISOString(),
      chat_id: currentChatId,
    };
    messages.value = [...messages.value, tempUserMsg];

    try {
      const { data, error: apiError } = await client.POST("/api/chats/{chat_id}/messages", {
        params: { path: { chat_id: currentChatId } },
        body: { content },
      });

      if (apiError) throw new Error("Failed to send message");

      // Replace optimistic message with real one (if needed) or just append the response
      // The API returns the Assistant's response message.
      // We might need to refresh or handle the response.
      // Assuming data is the Assistant Message.
      if (data) {
        messages.value = [...messages.value, data];
      }
    } catch (err) {
      console.error("Failed to send message", err);
      // Remove optimistic message or show error state
    }
  };

  watch(
    () => getChatId(),
    (newChatId) => {
      if (autoLoad && newChatId) {
        messages.value = [];
        hasMore.value = false;
        nextCursor.value = null;
        loadMessages();
      } else if (!newChatId) {
        messages.value = [];
        hasMore.value = false;
        nextCursor.value = null;
      }
    },
    { immediate: true },
  );

  return {
    messages,
    loading,
    hasMore,
    error,
    loadMore,
    refresh,
    sendMessage,
  };
}
