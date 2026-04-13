<template>
  <section class="prompts">
    <div class="prompts__wrapper">
      <ThePanelAdminPromptsHero
        :total="prompts.length"
        :visible="filteredPrompts.length"
      />

      <div class="prompts__demo">
        <div class="prompts__demo-head">
          <div>
            <h3 class="title-sm">Демо-тест AI</h3>
            <p class="prompts__demo-text">
              Выберите промт и обращение, чтобы прогнать анализ без сохранения в
              базу.
            </p>
          </div>
          <UiButton
            class="primary-btn"
            label="Запустить тест"
            before-icon="ai-i"
            icon-color="white"
            icon-size="size-20"
            :disabled="isTesting"
            @action="runDemoTest"
          />
        </div>

        <div class="prompts__demo-grid">
          <UiSelect
            v-model="selectedDemoPrompt"
            label="Промт"
            placeholder="Выберите промт"
            :options="prompts"
            :is-search="true"
            :is-clear="false"
          />
          <UiSelect
            v-model="selectedDemoAppeal"
            label="Обращение"
            placeholder="Выберите обращение"
            :options="appealOptions"
            :is-search="true"
            :is-clear="false"
          />
        </div>

        <div v-if="demoResult" class="prompts__demo-result">
          <div class="prompts__demo-result-head">
            <h4 class="title-sm">Результат теста</h4>
            <p class="prompts__demo-result-meta">
              {{ demoResult.meta }}
            </p>
          </div>
          <div class="prompts__demo-sections">
            <div class="prompts__demo-section">
              <p class="prompts__demo-section-title">Краткий вывод</p>
              <p class="prompts__demo-section-text">
                {{ demoResult.shortSummary }}
              </p>
            </div>

            <div class="prompts__demo-section">
              <p class="prompts__demo-section-title">Как AI объяснил решение</p>
              <p class="prompts__demo-section-text">
                {{ demoResult.analysisSummary || "—" }}
              </p>
            </div>

            <div
              v-if="demoResult.evidence?.length || demoResult.uncertainties?.length"
              class="prompts__demo-grid-details"
            >
              <div v-if="demoResult.evidence?.length" class="prompts__demo-section">
                <p class="prompts__demo-section-title">Факты и наблюдения</p>
                <ul class="prompts__demo-list">
                  <li
                    v-for="(item, index) in demoResult.evidence"
                    :key="`evidence-${index}`"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>
              <div
                v-if="demoResult.uncertainties?.length"
                class="prompts__demo-section"
              >
                <p class="prompts__demo-section-title">Неопределённости</p>
                <ul class="prompts__demo-list">
                  <li
                    v-for="(item, index) in demoResult.uncertainties"
                    :key="`uncertainty-${index}`"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="prompts__demo-section">
              <p class="prompts__demo-section-title">Детальный JSON</p>
              <pre class="prompts__demo-pre">{{ demoResult.pretty }}</pre>
            </div>
          </div>
        </div>
      </div>

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

      <UiUpToTop class="prompts__up" />
    </div>
  </section>

  <UiModal
    :is-open="isDemoProcessingOpen"
    title="AI анализирует обращение"
    max-width="720px"
    @close="closeDemoProcessing"
  >
    <ModalsAiProcessing
      :attempts="0"
      title="AI анализирует выбранное обращение"
      :messages="demoMessages"
    />
  </UiModal>
</template>

<script setup>
const api = useApi();
useSeo({ title: "AI Промты" });

const moduleOptions = [
  { id: 1, value: "appeals", name: "Обращения" },
  { id: 2, value: "support", name: "Поддержка" },
  { id: 3, value: "translations", name: "Переводы" },
  { id: 4, value: "moderation", name: "Модерация" },
];

const filterModuleOptions = [
  { id: 0, value: "all", name: "Все модули" },
  ...moduleOptions,
];

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

const prompts = ref([]);
const appeals = ref([]);
const selectedPromptId = ref(null);
const selectedModule = ref(moduleOptions[0]);
const selectedTone = ref(toneOptions[0]);
const selectedFilterModule = ref(filterModuleOptions[0]);
const selectedDemoPrompt = ref(null);
const selectedDemoAppeal = ref(null);
const demoResult = ref(null);
const isDemoProcessingOpen = ref(false);
const isTesting = ref(false);
const search = ref("");
const submitted = ref(false);
const form = ref(createEmptyForm());
const isLoading = ref(false);

const appealOptions = computed(() =>
  appeals.value.map((appeal) => ({
    id: appeal.id,
    name:
      `${appeal.description || "Обращение"} · ${appeal.category || "без категории"}`.slice(
        0,
        120,
      ),
    description: appeal.description || "",
    location: appeal.location || {},
    photos: appeal.photos || [],
    status: appeal.status || "",
    priority: appeal.priority || "",
  })),
);

const normalizePrompt = (prompt) => ({
  id: prompt.id,
  key: prompt.key || "",
  name: prompt.name || "",
  module: prompt.module || "appeals",
  moduleLabel:
    moduleOptions.find((option) => option.value === prompt.module)?.name ||
    prompt.moduleLabel ||
    "Обращения",
  tone: prompt.tone || "strict",
  toneLabel:
    toneOptions.find((option) => option.value === prompt.tone)?.name ||
    prompt.toneLabel ||
    "Строгий",
  systemPrompt: prompt.systemPrompt || "",
  userTemplate: prompt.userTemplate || "",
  guardrails: prompt.guardrails || "",
  exampleInput: prompt.exampleInput || "",
  exampleOutput: prompt.exampleOutput || "",
  updatedAt: prompt.updatedAt || createTimestamp(),
});

const loadPrompts = async () => {
  isLoading.value = true;
  try {
    const response = await useFetchSsr({ url: "/ai/prompts", method: "get" });
    const list = response?.data || response || [];
    prompts.value = list.map(normalizePrompt);
    if (!selectedDemoPrompt.value && prompts.value.length) {
      selectedDemoPrompt.value = prompts.value[0];
    }
  } catch (error) {
    useNotify({
      title: "Промты",
      text: error?.statusMessage || error?.data?.statusMessage || "Не удалось загрузить промты",
      status: "error",
    });
    prompts.value = [];
  } finally {
    isLoading.value = false;
  }
};

const loadAppeals = async () => {
  try {
    const response = await useFetchSsr({
      url: "/appeals",
      method: "get",
      params: {
        role: "admin",
        page: 1,
        limit: 50,
      },
    });

    appeals.value = (response?.data || response || []).map((appeal) => ({
      id: appeal.id,
      description: appeal.description || "",
      category: appeal.category || "",
      status: appeal.status || "",
      priority: appeal.priority || "",
      location: appeal.location || {},
      photos: appeal.photos || [],
    }));

    if (!selectedDemoAppeal.value && appealOptions.value.length) {
      selectedDemoAppeal.value = appealOptions.value[0];
    }
  } catch (error) {
    useNotify({
      title: "Промты",
      text:
        error?.statusMessage ||
        error?.data?.statusMessage ||
        "Не удалось загрузить обращения для теста",
      status: "error",
    });
    appeals.value = [];
  }
};

const filteredPrompts = computed(() => {
  const normalizedSearch = search.value.trim().toLowerCase();

  return prompts.value.filter((prompt) => {
    const matchesSearch =
      !normalizedSearch ||
      [
        prompt.key,
        prompt.name,
        prompt.systemPrompt,
        prompt.userTemplate,
        prompt.guardrails,
      ]
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

const runDemoTest = async () => {
  if (!selectedDemoPrompt.value?.id || !selectedDemoAppeal.value?.id) {
    useNotify({
      title: "Тест AI",
      text: "Выберите промт и обращение для теста",
      status: "error",
    });
    return;
  }

  isTesting.value = true;
  isDemoProcessingOpen.value = true;
  demoResult.value = null;

  try {
    const response = await api.client({
      url: "/ai/prompts/test",
      method: "post",
      body: {
        promptId: selectedDemoPrompt.value.id,
        appealId: selectedDemoAppeal.value.id,
      },
    });

    const data = response?.data || response || {};
    const result = data?.result?.json || data?.result || {};
    demoResult.value = {
      meta: `Промт: ${selectedDemoPrompt.value.name} · Обращение: ${selectedDemoAppeal.value.name}`,
      shortSummary: result.shortSummary || "—",
      analysisSummary: result.analysisSummary || "—",
      evidence: Array.isArray(result.evidence) ? result.evidence : [],
      uncertainties: Array.isArray(result.uncertainties) ? result.uncertainties : [],
      pretty: JSON.stringify(data, null, 2),
    };
  } catch (error) {
    useNotify({
      title: "Тест AI",
      text:
        error?.statusMessage ||
        error?.data?.statusMessage ||
        "Не удалось выполнить демо-тест",
      status: "error",
    });
  } finally {
    isTesting.value = false;
    isDemoProcessingOpen.value = false;
  }
};

const closeDemoProcessing = () => {
  isDemoProcessingOpen.value = false;
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
    moduleOptions.find((option) => option.value === prompt.module) ||
    moduleOptions[0];
  selectedTone.value =
    toneOptions.find((option) => option.value === prompt.tone) ||
    toneOptions[0];
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
  };

  const request = selectedPromptId.value
    ? api.client({
        url: `/ai/prompts/${selectedPromptId.value}`,
        method: "patch",
        body: payload,
      })
    : api.client({
        url: "/ai/prompts",
        method: "post",
        body: payload,
      });

  request
    .then((response) => {
      const saved = normalizePrompt(response?.data || response);
      if (selectedPromptId.value) {
        prompts.value = prompts.value.map((prompt) =>
          String(prompt.id) === String(selectedPromptId.value) ? saved : prompt,
        );
      } else {
        prompts.value.unshift(saved);
      }
      resetForm();
    })
    .catch((error) => {
      useNotify({
        title: "Промты",
        text: error?.statusMessage || error?.data?.statusMessage || "Не удалось сохранить промт",
        status: "error",
      });
    });
};

const removePrompt = (id) => {
  if (!id) return;
  api.client({
    url: `/ai/prompts/${id}`,
    method: "delete",
  })
    .then(() => {
      prompts.value = prompts.value.filter((prompt) => String(prompt.id) !== String(id));
      if (String(selectedPromptId.value) === String(id)) resetForm();
    })
    .catch((error) => {
      useNotify({
        title: "Промты",
        text: error?.statusMessage || error?.data?.statusMessage || "Не удалось удалить промт",
        status: "error",
      });
    });
};

const demoMessages = [
  "AI читает описание и фото выбранного обращения...",
  "Сверяем признаки проблемы, категорию и приоритет...",
  "Проверяем дедлайн, назначение сотрудника и уровень уверенности...",
  "Формируем подробный результат теста без записи в базу...",
];

await loadPrompts();
await loadAppeals();
</script>

<style lang="scss" scoped>
.prompts {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }

  &__demo {
    padding: 18px;
    border-radius: $border-r-lg;
    background-color: $white;
    border: 1px solid $surface-200;
    box-shadow: $box-shadow;
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }

  &__demo-head {
    display: flex;
    justify-content: space-between;
    gap: $gap-md;
    align-items: flex-start;
  }

  &__demo-text {
    color: $surface-500;
    margin-top: 4px;
  }

  &__demo-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $gap-md;
  }

  &__demo-result {
    display: flex;
    flex-direction: column;
    gap: $gap-sm;
    padding: $padding-md;
    border-radius: $border-r-md;
    background-color: $surface-100;
  }

  &__demo-sections {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }

  &__demo-grid-details {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $gap-md;
  }

  &__demo-section {
    display: flex;
    flex-direction: column;
    gap: $gap-xs;
    padding: $padding-sm;
    border-radius: $border-r-md;
    background-color: $white;
    border: 1px solid $surface-200;
  }

  &__demo-section-title {
    font-weight: 700;
  }

  &__demo-section-text {
    color: $surface-600;
    line-height: 1.5;
  }

  &__demo-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-left: 18px;
    list-style: disc;
    color: $surface-600;
  }

  &__demo-result-head {
    display: flex;
    justify-content: space-between;
    gap: $gap-md;
    align-items: center;
  }

  &__demo-result-meta {
    color: $surface-500;
    font-size: 13px;
  }

  &__demo-pre {
    padding: $padding-md;
    border-radius: $border-r-md;
    background-color: $surface-150;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 13px;
    line-height: 1.5;
  }

  &__up {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 50;
  }
}

@media (max-width: 900px) {
  .prompts {
    &__demo-head,
    &__demo-result-head {
      flex-direction: column;
    }

    &__demo-grid {
      grid-template-columns: 1fr;
    }

    &__demo-grid-details {
      grid-template-columns: 1fr;
    }
  }
}
</style>
