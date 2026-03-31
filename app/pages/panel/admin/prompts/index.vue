<template>
  <section class="prompts-page">
    <ThePanelAdminPromptsHero
      :total="prompts.length"
      :visible="filteredPrompts.length"
    />

    <ThePanelAdminPromptsForm
      :form="form"
      :submitted="submitted"
      :is-editing="Boolean(selectedPromptId)"
      :selected-module="selectedModule"
      :selected-tone="selectedTone"
      :module-options="moduleOptions"
      :tone-options="toneOptions"
      @reset="resetForm"
      @remove="removePrompt(selectedPromptId)"
      @save="savePrompt"
      @update:field="updateField"
      @update:module="selectedModule = $event"
      @update:tone="selectedTone = $event"
    />

    <ThePanelAdminPromptsList
      :prompts="filteredPrompts"
      :search="search"
      :selected-prompt-id="selectedPromptId"
      :selected-filter-module="selectedFilterModule"
      :filter-module-options="filterModuleOptions"
      @reset="resetForm"
      @select="editPrompt"
      @update:search="search = $event"
      @update:filter-module="selectedFilterModule = $event"
    />

    <UiUpToTop class="prompts-page__up" />
  </section>
</template>

<script setup>
useSeo({ title: "AI Промты" });

const moduleOptions = [
  { id: 1, value: "appeals", name: "Обращения" },
  { id: 2, value: "support", name: "Поддержка" },
  { id: 3, value: "translations", name: "Переводы" },
  { id: 4, value: "moderation", name: "Модерация" },
];

const filterModuleOptions = [{ id: 0, value: "all", name: "Все модули" }, ...moduleOptions];

const toneOptions = [
  { id: 1, value: "formal", name: "Формальный" },
  { id: 2, value: "friendly", name: "Дружелюбный" },
  { id: 3, value: "strict", name: "Строгий" },
];

const createTimestamp = () =>
  new Date().toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const createInitialPrompts = () => [
  {
    id: 1,
    key: "appeal_moderation",
    name: "Модерация обращений",
    module: "appeals",
    moduleLabel: "Обращения",
    tone: "strict",
    toneLabel: "Строгий",
    systemPrompt:
      "Ты анализируешь обращения граждан и определяешь категорию, риск и корректность формулировок.",
    userTemplate:
      "Проанализируй обращение, выдели тему, срочность и предложи краткий итог.",
    guardrails:
      "Не придумывай факты, не меняй смысл обращения, не добавляй юридические выводы без основания.",
    exampleInput: "Во дворе уже неделю не вывозят мусор.",
    exampleOutput:
      "Категория: ЖКХ. Срочность: средняя. Итог: требуется вывоз мусора.",
    updatedAt: createTimestamp(),
  },
  {
    id: 2,
    key: "support_assistant",
    name: "AI для поддержки",
    module: "support",
    moduleLabel: "Поддержка",
    tone: "friendly",
    toneLabel: "Дружелюбный",
    systemPrompt:
      "Ты помогаешь пользователям CityHelp быстро понять статус заявки и следующие шаги.",
    userTemplate:
      "Ответь пользователю простым языком, что происходит с обращением и что делать дальше.",
    guardrails:
      "Не обещай сроки без данных из системы. Не раскрывай внутреннюю информацию сотрудников.",
    exampleInput: "Почему моя заявка до сих пор в обработке?",
    exampleOutput:
      "Ваша заявка принята и находится в работе. Как только статус изменится, вы получите уведомление.",
    updatedAt: createTimestamp(),
  },
];

const createEmptyForm = () => ({
  key: "",
  name: "",
  systemPrompt: "",
  userTemplate: "",
  guardrails: "",
  exampleInput: "",
  exampleOutput: "",
});

const prompts = ref(createInitialPrompts());
const selectedPromptId = ref(null);
const selectedModule = ref(moduleOptions[0]);
const selectedTone = ref(toneOptions[0]);
const selectedFilterModule = ref(filterModuleOptions[0]);
const search = ref("");
const submitted = ref(false);
const form = ref(createEmptyForm());

const filteredPrompts = computed(() => {
  const normalizedSearch = search.value.trim().toLowerCase();

  return prompts.value.filter((prompt) => {
    const matchesSearch =
      !normalizedSearch ||
      [prompt.key, prompt.name, prompt.systemPrompt, prompt.userTemplate, prompt.guardrails]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesModule =
      selectedFilterModule.value.value === "all" ||
      prompt.module === selectedFilterModule.value.value;

    return matchesSearch && matchesModule;
  });
});

const updateField = (field, value) => {
  form.value[field] = value;
};

const resetForm = () => {
  form.value = createEmptyForm();
  selectedPromptId.value = null;
  selectedModule.value = moduleOptions[0];
  selectedTone.value = toneOptions[0];
  submitted.value = false;
};

const editPrompt = (prompt) => {
  selectedPromptId.value = prompt.id;
  selectedModule.value =
    moduleOptions.find((option) => option.value === prompt.module) || moduleOptions[0];
  selectedTone.value =
    toneOptions.find((option) => option.value === prompt.tone) || toneOptions[0];
  form.value = {
    key: prompt.key,
    name: prompt.name,
    systemPrompt: prompt.systemPrompt,
    userTemplate: prompt.userTemplate,
    guardrails: prompt.guardrails,
    exampleInput: prompt.exampleInput,
    exampleOutput: prompt.exampleOutput,
  };
};

const savePrompt = () => {
  submitted.value = true;

  if (!form.value.key.trim() || !form.value.name.trim()) return;

  const payload = {
    key: form.value.key.trim(),
    name: form.value.name.trim(),
    module: selectedModule.value.value,
    moduleLabel: selectedModule.value.name,
    tone: selectedTone.value.value,
    toneLabel: selectedTone.value.name,
    systemPrompt: form.value.systemPrompt.trim(),
    userTemplate: form.value.userTemplate.trim(),
    guardrails: form.value.guardrails.trim(),
    exampleInput: form.value.exampleInput.trim(),
    exampleOutput: form.value.exampleOutput.trim(),
    updatedAt: createTimestamp(),
  };

  if (selectedPromptId.value) {
    prompts.value = prompts.value.map((prompt) =>
      prompt.id === selectedPromptId.value ? { ...prompt, ...payload } : prompt,
    );
  } else {
    prompts.value.unshift({ id: Date.now(), ...payload });
  }

  resetForm();
};

const removePrompt = (id) => {
  if (!id) return;
  prompts.value = prompts.value.filter((prompt) => prompt.id !== id);
  if (selectedPromptId.value === id) resetForm();
};
</script>

<style lang="scss" scoped>
.prompts-page {
  display: flex;
  flex-direction: column;
  gap: $gap-xl;

  &__up {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 50;
  }
}
</style>
