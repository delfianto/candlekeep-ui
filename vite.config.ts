import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import Terminal from "vite-plugin-terminal";

export default defineConfig({
  plugins: [
    vue(),
    Terminal({
      // Directs all browser logs to terminal
      console: "terminal",

      // Ensures it logs to BOTH terminal AND the browser console (just in case)
      output: ["console", "terminal"],
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
