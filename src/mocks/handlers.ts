import { http, HttpResponse, delay } from "msw";
import { characters } from "@/mocks/data/characters";
import { chats } from "@/mocks/data/chats";
import { messages } from "@/mocks/data/messages";
import { providers } from "@/mocks/data/providers";
import { modelsPages, modelsFilteredByName } from "@/mocks/data/models";
import { personas } from "@/mocks/data/personas";
import { modelFamiliesPages, modelFamiliesFilteredByName } from "@/mocks/data/model-families";
import { modelFamiliesParameterDocs } from "@/mocks/data/model-parameters";
import type { components } from "@/api/schema";

type Chat = components["schemas"]["ChatResponse"];
type Message = components["schemas"]["MessageResponse"];

const db = {
  characters,
  chats,
  messages,
  providers,
  modelsPages,
  personas,
  modelFamiliesPages,
};

export const handlers = [
  // Health check
  http.get("/api/health", () => {
    return HttpResponse.json({ status: "ok", timestamp: new Date().toISOString() });
  }),

  // Characters
  http.get("/api/characters", async () => {
    await delay(150);
    return HttpResponse.json(db.characters);
  }),

  http.get("/api/characters/:id", async ({ params }) => {
    const char = db.characters.find((c) => c.id === params.id);
    if (!char) return new HttpResponse(null, { status: 404 });
    await delay(150);
    return HttpResponse.json(char);
  }),

  // Chats
  http.get("/api/chats", async () => {
    await delay(200);
    // Return chats sorted by updated_at descending
    const sortedChats = [...db.chats].sort((a, b) => {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
    return HttpResponse.json(sortedChats);
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
    db.messages[newChat.id] = [];
    await delay(400);
    return HttpResponse.json(newChat);
  }),

  http.get("/api/chats/:chatId", async ({ params }) => {
    const chat = db.chats.find((c) => c.id === params.chatId);
    if (!chat) return new HttpResponse(null, { status: 404 });
    await delay(150);
    return HttpResponse.json(chat);
  }),

  // Messages
  http.get("/api/chats/:chatId/messages", async ({ params }) => {
    const chatId = params.chatId as string;
    const chatMessages = db.messages[chatId] || [];
    await delay(100);
    return HttpResponse.json(chatMessages);
  }),

  http.post("/api/chats/:chatId/messages", async ({ params, request }) => {
    const chatId = params.chatId as string;
    const body = (await request.json()) as any;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      chat_id: chatId,
      role: "user",
      content: body.content,
      created_at: new Date().toISOString(),
    };

    if (!db.messages[chatId]) db.messages[chatId] = [];
    db.messages[chatId].push(userMsg);

    // update chat's updated_at
    const chat = db.chats.find((c) => c.id === chatId);
    if (chat) {
      chat.updated_at = new Date().toISOString();
    }

    await delay(800);

    const aiMsg: Message = {
      id: `msg-${Date.now() + 1}`,
      chat_id: chatId,
      role: "assistant",
      content: `[Mock AI Response] You said: "${body.content}". This is a simulated reply.`,
      created_at: new Date(Date.now() + 1).toISOString(),
    };
    db.messages[chatId].push(aiMsg);

    return HttpResponse.json(aiMsg);
  }),

  // LLM Providers
  http.get("/api/providers", async () => {
    await delay(100);
    return HttpResponse.json(db.providers);
  }),

  // Models
  http.get("/api/models", async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const nameParam = url.searchParams.get("name");

    if (nameParam && nameParam.toLowerCase().includes("claude")) {
      return HttpResponse.json(modelsFilteredByName);
    }

    const pageParam = url.searchParams.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const pageData = db.modelsPages.find((p) => p.current_page === page);
    if (!pageData) return HttpResponse.json(db.modelsPages[0]);
    return HttpResponse.json(pageData);
  }),

  http.get("/api/models/:modelId", async ({ params }) => {
    const modelId = params.modelId as string;
    let foundModel = null;
    for (const page of db.modelsPages) {
      foundModel = page.items.find((m: components["schemas"]["ModelResponse"]) => m.id === modelId);
      if (foundModel) break;
    }

    if (!foundModel) return new HttpResponse(null, { status: 404 });
    await delay(100);
    return HttpResponse.json(foundModel);
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

  // Model Families
  http.get("/api/model-families", async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const nameParam = url.searchParams.get("name");

    if (nameParam && nameParam.toLowerCase().includes("claude")) {
      return HttpResponse.json(modelFamiliesFilteredByName);
    }

    const pageParam = url.searchParams.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 1;

    // Find the page object that matches the requested page number
    const pageData = db.modelFamiliesPages.find((p) => p.current_page === page);

    // Fallback to empty page or 404 if not found, but for mock let's return first page if out of bounds or empty structure
    // Since we know we have pages 1, 2, 3
    if (!pageData) {
      return HttpResponse.json(db.modelFamiliesPages[0]);
    }

    return HttpResponse.json(pageData);
  }),

  // Model Family Parameter Docs
  http.get("/api/model-families/parameter-docs", async () => {
    await delay(50);
    return HttpResponse.json(modelFamiliesParameterDocs);
  }),
];
