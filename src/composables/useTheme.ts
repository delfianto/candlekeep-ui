import { ref, watch, onMounted } from "vue";

export function useTheme() {
  const isDark = ref(false);

  // Initialize theme from localStorage or system preference
  onMounted(() => {
    const stored = localStorage.getItem("theme-mode");
    if (
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      isDark.value = true;
    }
  });

  // Watch for changes and update DOM + LocalStorage
  watch(
    isDark,
    (val) => {
      if (val) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme-mode", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme-mode", "light");
      }
    },
    { immediate: true },
  );

  function toggleTheme() {
    isDark.value = !isDark.value;
  }

  return { isDark, toggleTheme };
}
