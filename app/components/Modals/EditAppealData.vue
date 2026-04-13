<template>
  <div class="edit">
    <div class="edit__wrapper">
      <p class="edit__text">
        Измените данные обращения перед повторной проверкой или назначением в работу.
      </p>

      <div class="edit__grid">
        <UiSelect
          v-model="selectedEmployee"
          :options="employeeOptions"
          label="Сотрудник"
          placeholder="Выберите сотрудника"
          search-placeholder="Поиск сотрудника"
          :is-search="true"
          :is-clear="false"
        />

        <UiSelect
          v-model="selectedCategory"
          :options="categoryOptions"
          label="Категория"
          placeholder="Выберите категорию"
          search-placeholder="Поиск категории"
          :is-search="true"
          :is-clear="false"
        />

        <UiSelect
          v-model="selectedSubCategory"
          :options="subCategoryOptions"
          label="Подкатегория"
          placeholder="Выберите подкатегорию"
          search-placeholder="Поиск подкатегории"
          :is-search="true"
          :is-clear="false"
          :disabled="!subCategoryOptions.length"
        />

        <UiSelect
          v-model="selectedPriority"
          :options="priorityOptions"
          label="Приоритет"
          placeholder="Выберите приоритет"
          :is-search="false"
          :is-clear="false"
        />

        <UiInput
          v-model="deadlineAt"
          label="Дедлайн"
          type="datetime-local"
        />
      </div>

      <div class="edit__btns">
        <UiButton
          class="edit__btn secondary-btn"
          label="Отмена"
          @action="emit('close')"
        />
        <UiButton
          class="edit__btn primary-btn"
          :label="isSubmitting ? 'Сохранение...' : 'Сохранить изменения'"
          :disabled="isSubmitting || !selectedCategory || !selectedPriority || !deadlineAt"
          @action="save"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  appeal: {
    type: Object,
    default: null,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  employees: {
    type: Array,
    default: () => [],
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "save"]);

const priorityOptions = [
  { id: 1, value: "urgent", name: "Срочный" },
  { id: 2, value: "high", name: "Высокий" },
  { id: 3, value: "medium", name: "Средний" },
  { id: 4, value: "low", name: "Низкий" },
];

const selectedEmployee = ref(null);
const selectedCategory = ref(null);
const selectedSubCategory = ref(null);
const selectedPriority = ref(priorityOptions[2]);
const deadlineAt = ref("");

const employeeOptions = computed(() => props.employees || []);
const categoryOptions = computed(() => props.categories || []);
const subCategoryOptions = computed(() => {
  const category = selectedCategory.value || null;
  const subcategories = Array.isArray(category?.subcategories) ? category.subcategories : [];
  return subcategories.map((item, index) => ({
    id: `${category?.id || category?.key || "sub"}-${index}`,
    value: item,
    name: item,
  }));
});

const formatDeadlineInput = (value) => {
  if (!value) return "";
  const date = new Date(String(value).replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "";
  const pad = (num) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const syncState = () => {
  const appeal = props.appeal || {};
  selectedEmployee.value =
    employeeOptions.value.find(
      (item) =>
        String(item.id) ===
        String(
          appeal.assignedEmployee?.id ||
            appeal.assignedEmployee?._id ||
            appeal.assignedEmployee ||
            "",
        ),
    ) || employeeOptions.value[0] || null;
  selectedCategory.value =
    categoryOptions.value.find((item) => item.key === appeal.category) ||
    categoryOptions.value[0] ||
    null;
  selectedPriority.value =
    priorityOptions.find((item) => item.value === appeal.priority) ||
    priorityOptions[2];
  deadlineAt.value = formatDeadlineInput(appeal.deadlineAt || appeal.aiResult?.deadlineAt);
  const currentSubCategory = String(appeal.subCategory || "").trim();
  if (currentSubCategory) {
    selectedSubCategory.value =
      (selectedCategory.value?.subcategories || [])
        .map((item, index) => ({
          id: `${selectedCategory.value?.key || "sub"}-${index}`,
          value: item,
          name: item,
        }))
        .find((item) => item.value === currentSubCategory) || null;
  }
};

watch(
  () => [props.appeal, props.categories, props.employees],
  syncState,
  { immediate: true, deep: true },
);

watch(selectedCategory, () => {
  const firstSubCategory = subCategoryOptions.value[0] || null;
  selectedSubCategory.value = firstSubCategory;
});

const save = () => {
  emit("save", {
    employeeId: selectedEmployee.value?.id || "",
    category: selectedCategory.value?.key || "",
    subCategory: selectedSubCategory.value?.value || "",
    priority: selectedPriority.value?.value || "medium",
    deadlineAt: deadlineAt.value,
  });
};
</script>

<style lang="scss" scoped>
.edit {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }

  &__text {
    color: $surface-600;
    line-height: 1.5;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $gap-md;
  }

  &__btns {
    display: flex;
    justify-content: flex-end;
    gap: $gap-md;
    margin-top: $gap-sm;
  }

  &__btn {
    min-width: 160px;
  }
}

@media (max-width: 768px) {
  .edit {
    &__grid {
      grid-template-columns: 1fr;
    }

    &__btns {
      flex-direction: column;
    }

    &__btn {
      width: 100%;
    }
  }
}
</style>
