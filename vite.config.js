import Terminal from "vite-plugin-terminal";
import ViteYaml from "@modyfi/vite-plugin-yaml";
import autoprefixer from "autoprefixer";
import tailwindcss from "@tailwindcss/postcss";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
export default defineConfig(function (_a) {
  var command = _a.command;
  return {
    plugins: [
      vue(),
      ViteYaml(),
      command === "serve" &&
        Terminal({
          // Directs all browser logs to terminal
          console: "terminal",
          // Ensures it logs to BOTH terminal AND the browser console
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
  };
});
