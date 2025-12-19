import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", name: "home", component: () => import("@/views/HomeView.vue") },
  { path: "/chats", name: "chats", component: () => import("@/views/ChatView.vue") },
  {
    path: "/characters",
    name: "characters",
    component: () => import("@/views/CharactersView.vue"),
  },
  { path: "/world", name: "world", component: () => import("@/views/WorldLoreView.vue") },
  { path: "/memory", name: "memory", component: () => import("@/views/MemoryView.vue") },
  { path: "/settings", name: "settings", component: () => import("@/views/SettingsView.vue") },
  { path: "/persona", name: "persona", component: () => import("@/views/PersonaView.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
