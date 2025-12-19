import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

async function prepareApp() {
  const useMocks = import.meta.env.VITE_USE_MOCKS === "true";

  if (import.meta.env.DEV && useMocks) {
    const { worker } = await import("./mocks/browser");
    return worker.start({
      onUnhandledRequest: "bypass",
    });
  }
}

prepareApp().then(() => {
  app.mount("#app");
});
