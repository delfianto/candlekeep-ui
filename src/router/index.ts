import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/characters",
      name: "characters",
      component: () => import("@/views/Home.vue"), // Placeholder
    },
    {
      path: "/presets",
      name: "presets",
      component: () => import("@/views/Home.vue"), // Placeholder
    },
    {
      path: "/lorebooks",
      name: "lorebooks",
      component: () => import("@/views/Home.vue"), // Placeholder
    },
  ],
});

export default router;
