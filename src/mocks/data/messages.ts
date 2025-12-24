import { conversationCache } from "../loader";

export function registerConversations() {
  // Aranwen conversations
  conversationCache.register("chat-aranwen-01", () => import("./scenarios/aranwen.yaml"), 12);
}

// Initialize registrations immediately
registerConversations();

/**
 * Legacy export for backward compatibility
 */
export const messages: Record<string, any> = new Proxy(
  {},
  {
    get() {
      return undefined;
    },
  },
);
