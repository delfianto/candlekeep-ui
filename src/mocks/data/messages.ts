// src/mocks/data/messages.ts
import { conversationCache } from "../loader";

/**
 * Register all conversations with lazy loaders
 * This only stores the import functions, not the actual data
 */
export function registerConversations() {
  // Aranwen conversations
  conversationCache.register("chat-aranwen-01", () => import("./scenarios/aranwen.yaml"), 12);

  // Note: The following files may need to be created
  // Check if these files exist before uncommenting
  /*
  conversationCache.register(
    "chat-aranwen-02",
    () => import("./scenarios/aranwen-2.yaml"),
    8
  );

  conversationCache.register(
    "chat-lynara-01",
    () => import("./scenarios/lynara.yaml"),
    10
  );

  conversationCache.register(
    "chat-lynara-02",
    () => import("./scenarios/lynara-2.yaml"),
    6
  );

  conversationCache.register(
    "chat-zahrasha-01",
    () => import("./scenarios/zahrasha.yaml"),
    15
  );

  conversationCache.register(
    "chat-zahrasha-02",
    () => import("./scenarios/zahrasha-2.yaml"),
    9
  );

  conversationCache.register(
    "chat-eloise-01",
    () => import("./scenarios/eloise.yaml"),
    5
  );

  conversationCache.register(
    "chat-eloise-02",
    () => import("./scenarios/eloise-2.yaml"),
    3
  );
  */

  // For now, we'll only register the existing aranwen.yaml
  // Add more as YAML files are created
}

// Initialize registrations immediately
registerConversations();

/**
 * Legacy export for backward compatibility
 * This will be empty initially and load on demand
 */
export const messages: Record<string, any> = new Proxy(
  {},
  {
    get() {
      // This will be handled by the async handler in handlers.ts
      return undefined;
    },
  },
);
