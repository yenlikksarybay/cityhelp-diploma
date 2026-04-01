<template>
  <section class="translations">
    <div class="translations__wrapper">
      <ThePanelAdminTranslationsHero
        :total="translations.length"
        :visible="filteredTranslations.length"
      />

      <ThePanelAdminTranslationsForm
        :form="form"
        :submitted="submitted"
        :is-editing="Boolean(selectedTranslationId)"
        @reset="resetForm"
        @save="saveTranslation"
        @update:field="updateField"
      />

      <ThePanelAdminTranslationsList
        :translations="filteredTranslations"
        :search="search"
        :selected-language="selectedLanguage"
        :language-options="languageOptions"
        :selected-translation-id="selectedTranslationId"
        @update:search="search = $event"
        @update:language="selectedLanguage = $event"
        @edit="editTranslation"
        @remove="removeTranslation"
      />

      <UiUpToTop class="translations__up" />
    </div>
  </section>
</template>

<script setup>
useSeo({ title: "Переводы" });

const languageOptions = [
  { id: 1, value: "all", name: "Все языки" },
  { id: 2, value: "kz", name: "KZ" },
  { id: 3, value: "ru", name: "RU" },
  { id: 4, value: "en", name: "EN" },
];

const createTimestamp = () =>
  new Date().toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const createInitialTranslations = () => [
  {
    id: 1,
    key: "panel.title",
    kz: "Бас панель",
    ru: "Панель управления",
    en: "Dashboard",
    updatedAt: createTimestamp(),
  },
  {
    id: 2,
    key: "appeal.create",
    kz: "Өтініш жасау",
    ru: "Создать обращение",
    en: "Create appeal",
    updatedAt: createTimestamp(),
  },
  {
    id: 3,
    key: "footer.support",
    kz: "Қолдау қызметі",
    ru: "Служба поддержки",
    en: "",
    updatedAt: createTimestamp(),
  },
];

const createEmptyForm = () => ({
  key: "",
  kz: "",
  ru: "",
  en: "",
});

const translations = ref(createInitialTranslations());
const selectedLanguage = ref(languageOptions[0]);
const search = ref("");
const selectedTranslationId = ref(null);
const submitted = ref(false);
const form = ref(createEmptyForm());

const filteredTranslations = computed(() => {
  const normalizedSearch = search.value.trim().toLowerCase();

  return translations.value.filter((translation) => {
    const matchesSearch =
      !normalizedSearch ||
      [translation.key, translation.kz, translation.ru, translation.en]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesLanguage =
      selectedLanguage.value.value === "all" ||
      Boolean(translation[selectedLanguage.value.value]?.trim());

    return matchesSearch && matchesLanguage;
  });
});

const updateField = (field, value) => {
  form.value[field] = value;
};

const resetForm = () => {
  form.value = createEmptyForm();
  selectedTranslationId.value = null;
  submitted.value = false;
};

const editTranslation = (translation) => {
  selectedTranslationId.value = translation.id;
  form.value = {
    key: translation.key,
    kz: translation.kz,
    ru: translation.ru,
    en: translation.en,
  };
};

const saveTranslation = () => {
  submitted.value = true;

  if (!form.value.key.trim()) return;

  const payload = {
    key: form.value.key.trim(),
    kz: form.value.kz.trim(),
    ru: form.value.ru.trim(),
    en: form.value.en.trim(),
    updatedAt: createTimestamp(),
  };

  if (selectedTranslationId.value) {
    translations.value = translations.value.map((translation) =>
      translation.id === selectedTranslationId.value
        ? { ...translation, ...payload }
        : translation,
    );
  } else {
    translations.value.unshift({ id: Date.now(), ...payload });
  }

  resetForm();
};

const removeTranslation = (id) => {
  translations.value = translations.value.filter(
    (translation) => translation.id !== id,
  );
  if (selectedTranslationId.value === id) resetForm();
};
</script>

<style lang="scss" scoped>
.translations {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }
  &__up {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 50;
  }
}
</style>
