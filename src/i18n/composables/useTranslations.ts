import { watch } from "vue";
import { loadTranslations } from "../utils/load";
import { locale, translations } from "../store";
import { onMounted } from "vue";

export const useTranslations = () => {
  onMounted(() => {
    locale.value = "en";
  });

  watch(locale, () => {
    if (!locale.value) return;
    window.localStorage.setItem("portfolio-locale", "en");
  });

  watch(
    locale,
    async (newLocale) => {
      if (!newLocale) return;
      if (typeof document !== "undefined") {
        document.documentElement.lang = newLocale;
      }
      translations.value = (await loadTranslations("common", newLocale)) ?? {};
    },
    { immediate: true },
  );
};
