import { http, HttpResponse, delay } from "msw";
import { characters } from "@/mocks/data/characters";
import { chats } from "@/mocks/data/chats";
import { providers } from "@/mocks/data/providers";
import { modelsPages, modelsFilteredByName } from "@/mocks/data/models";
import { allModelsMock } from "@/mocks/data/models-data";
import { personas } from "@/mocks/data/personas";
import { modelFamiliesPages, modelFamiliesFilteredByName } from "@/mocks/data/model-families";
import { allModelFamiliesMock } from "@/mocks/data/model-families-data";
import { modelFamiliesParameterDocs } from "@/mocks/data/model-parameters";
import { conversationCache } from "@/mocks/loader";
import "@/mocks/data/messages"; // Initialize registrations
import type { components } from "@/api/schema";

type Chat = components["schemas"]["ChatResponse"];

const db = {
  characters,
  chats,
  // Remove: messages - now handled by conversationCache
  providers,
  modelsPages,
  allModelsMock,
  personas,
  modelFamiliesPages,
  allModelFamiliesMock,
};

export const handlers = [
  // Health check
  http.get("/api/health", () => {
    return HttpResponse.json({ status: "ok", timestamp: new Date().toISOString() });
  }),

  // Characters
  http.get("/api/characters", async () => {
    await delay(150);
    return HttpResponse.json({
      items: db.characters,
      meta: {
        limit: 100, // Assuming default limit
        has_more: false,
        total: db.characters.length,
        page: 1,
      },
    });
  }),

  http.get("/api/characters/:id", async ({ params }) => {
    const char = db.characters.find((c) => c.id === params.id);
    if (!char) return new HttpResponse(null, { status: 404 });
    await delay(150);
    return HttpResponse.json(char);
  }),

  // Chats
  http.get("/api/chats", async ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const cursor = url.searchParams.get("cursor") || undefined;

    await delay(200);

    // Sort chats by updated_at descending
    const allChats = [...db.chats].sort((a, b) => {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    let startIndex = 0;
    if (cursor) {
      // Find the index of the chat with updated_at <= cursor
      // (Simplified logic: find the first chat with updated_at < cursor)
      const cursorDate = new Date(cursor).getTime();
      startIndex = allChats.findIndex((chat) => new Date(chat.updated_at).getTime() < cursorDate);
      if (startIndex === -1) startIndex = allChats.length;
    }

    const paginatedChats = allChats.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < allChats.length;
    const nextCursor = hasMore ? paginatedChats[paginatedChats.length - 1].updated_at : null;

    return HttpResponse.json({
      items: paginatedChats,
      meta: {
        limit,
        has_more: hasMore,
        cursor: nextCursor,
        total: allChats.length,
      },
    });
  }),

  http.post("/api/chats", async ({ request }) => {
    const body = (await request.json()) as any;
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      character_id: body.character_id,
      model_id: body.model_id || "model-1",
      title: body.title || "New Conversation",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.chats.unshift(newChat);
    // Note: For new chats, there's no need to initialize in conversationCache
    // as it will be handled by the dynamic import when messages are requested
    await delay(400);
    return HttpResponse.json(newChat);
  }),

  http.get("/api/chats/:chatId", async ({ params }) => {
    const chat = db.chats.find((c) => c.id === params.chatId);
    if (!chat) return new HttpResponse(null, { status: 404 });
    await delay(150);
    return HttpResponse.json(chat);
  }),

  // UPDATED: Messages endpoint with lazy loading and cursor-based pagination
  http.get("/api/chats/:chatId/messages", async ({ params, request }) => {
    const chatId = params.chatId as string;
    const url = new URL(request.url);

    // Parse pagination parameters
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const cursor = url.searchParams.get("cursor") || undefined;

    // Check if conversation exists
    if (!conversationCache.has(chatId)) {
      // Fallback: If chat exists in DB but not in cache (no YAML), generate a mock message
      const chatExists = db.chats.find((c) => c.id === chatId);
      if (chatExists) {
        await delay(100);
        const mockMsg = {
          id: `msg-default-${chatId}`,
          chat_id: chatId,
          role: "assistant" as const,
          content: `[Mock] This conversation with ${chatExists.title} hasn't been implemented in YAML yet. This is a placeholder message.`,
          created_at: new Date().toISOString(),
        };
        return HttpResponse.json({
          items: [mockMsg],
          meta: {
            limit,
            has_more: false,
            cursor: null,
            total: 1,
            page: 1,
          },
        });
      }

      await delay(100);
      return HttpResponse.json({
        items: [],
        meta: {
          limit,
          has_more: false,
          cursor: null,
          total: 0,
          page: 1,
        },
      });
    }

    await delay(100);

    // Return cursor-based paginated response
    const result = await conversationCache.getCursorPaginated(chatId, limit, cursor);

    if (!result) {
      return HttpResponse.json({
        items: [],
        meta: {
          limit,
          has_more: false,
          cursor: null,
        },
      });
    }

    return HttpResponse.json({
      items: result.messages,
      meta: {
        limit,
        has_more: result.hasMore,
        cursor: result.hasMore ? result.messages[result.messages.length - 1]?.created_at : null, // Cursor is the timestamp of the oldest message in the batch
      },
    });
  }),

  // UPDATED: Post message handler
  http.post("/api/chats/:chatId/messages", async ({ params, request }) => {
    const chatId = params.chatId as string;
    const body = (await request.json()) as any;

    const chat = db.chats.find((c) => c.id === chatId);
    if (chat) {
      chat.updated_at = new Date().toISOString();
    }

    await delay(800);

    const aiMsg = {
      id: `msg-${Date.now() + 1}`,
      chat_id: chatId,
      role: "assistant" as const,
      content: `[Mock AI Response] You said: "${body.content}". This is a simulated reply.`,
      created_at: new Date(Date.now() + 1).toISOString(),
    };

    return HttpResponse.json(aiMsg);
  }),

  // NEW: Prefetch endpoint (optional)
  http.post("/api/chats/:chatId/prefetch", async ({ params }) => {
    const chatId = params.chatId as string;

    if (!conversationCache.has(chatId)) {
      return new HttpResponse(null, { status: 404 });
    }

    conversationCache.preload(chatId).catch(console.error);

    return HttpResponse.json({ status: "prefetching" });
  }),

  // NEW: Cache management endpoint (optional, for debugging)
  http.post("/api/cache/clear", async ({ request }) => {
    const body = (await request.json()) as any;
    const chatId = body?.chatId;

    conversationCache.clearCache(chatId);

    return HttpResponse.json({
      status: "cleared",
      stats: conversationCache.getStats(),
    });
  }),

  // UPDATED: Health check with cache stats
  http.get("/api/health", () => {
    return HttpResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      cache_stats: conversationCache.getStats(),
    });
  }),

  // LLM Providers
  http.get("/api/providers", async () => {
    await delay(100);
    return HttpResponse.json(db.providers);
  }),

  // Models List
  http.get("/api/models", async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const nameParam = url.searchParams.get("name");

    if (nameParam && nameParam.toLowerCase().includes("claude")) {
      return HttpResponse.json(modelsFilteredByName);
    }

    const pageParam = url.searchParams.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const pageData = db.modelsPages.find((p) => p.meta.page === page);
    if (!pageData) return HttpResponse.json(db.modelsPages[0]);
    return HttpResponse.json(pageData);
  }),

  // Models Detail (Joined with Model Family)
  http.get("/api/models/:modelId", async ({ params }) => {
    const modelId = params.modelId as string;

    // 1. Find the model in the raw data
    const foundModel = db.allModelsMock.find((m) => m.id === modelId);

    if (!foundModel) {
      return new HttpResponse(null, { status: 404 });
    }

    // 2. Perform relational lookup for the Model Family
    const family = db.allModelFamiliesMock.find((f) => f.id === foundModel.model_family_id);

    // 3. Construct the response with the nested family object
    const responseData = {
      ...foundModel,
      model_family: family || null, // Should ideally always exist if data is consistent
    };

    await delay(100);
    return HttpResponse.json(responseData);
  }),

  // Personas
  http.get("/api/personas/", async () => {
    await delay(100);
    return HttpResponse.json(db.personas);
  }),

  http.get("/api/personas/:personaId", async ({ params }) => {
    const persona = db.personas.find((p) => p.id === params.personaId);
    if (!persona) return new HttpResponse(null, { status: 404 });
    await delay(100);
    return HttpResponse.json(persona);
  }),

  // Model Families List
  http.get("/api/model-families", async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const nameParam = url.searchParams.get("name");

    if (nameParam && nameParam.toLowerCase().includes("claude")) {
      return HttpResponse.json(modelFamiliesFilteredByName);
    }

    const pageParam = url.searchParams.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 1;

    const pageData = db.modelFamiliesPages.find((p) => p.meta.page === page);

    if (!pageData) {
      return HttpResponse.json(db.modelFamiliesPages[0]);
    }

    return HttpResponse.json(pageData);
  }),

  // Model Families Detail
  http.get("/api/model-families/parameter-docs", async () => {
    await delay(50);
    return HttpResponse.json(modelFamiliesParameterDocs);
  }),

  http.get("/api/model-families/:id", async ({ params }) => {
    const id = params.id as string;
    const family = db.allModelFamiliesMock.find((f) => f.id === id);

    if (!family) {
      return new HttpResponse(null, { status: 404 });
    }

    await delay(100);
    return HttpResponse.json(family);
  }),
];
