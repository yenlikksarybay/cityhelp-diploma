<template>
  <section class="appeals">
    <div class="appeals__wrapper">
      <UiTabs :tabs="tabs" v-model="oneTab" :is-scroll="true" />

      <div class="appeals__filter">
        <UiInput
          before-icon="lupa-i"
          icon-size="size-20"
          placeholder="Поиск по описанию"
          v-model="search"
        />
        <UiSelect
          placeholder="Приоритет"
          :options="priorities"
          v-model="onePriority"
        />
      </div>

      <ThePanelAdminAppealsTable :rows="filteredAppeals" />
    </div>
  </section>
</template>

<script setup>
const api = useApi();
useSeo({ title: "Список обращений" });

const search = ref("");
const priorities = [
  {
    id: 0,
    value: "",
    name: "Все",
  },
  {
    id: 1,
    value: "high",
    name: "Высокий",
  },
  {
    id: 2,
    value: "medium",
    name: "Средний",
  },
  { id: 3, value: "low", name: "Низкий" },
];
const onePriority = ref(priorities[0]);

const tabs = [
  {
    id: 1,
    value: "all",
    name: "Все",
    icon: "",
  },
  {
    id: 2,
    value: "moderation",
    name: "На модерации",
    icon: "time-i",
  },
  {
    id: 3,
    value: "processing",
    name: "В процессе",
    icon: "time-i",
  },
  {
    id: 4,
    value: "completed",
    name: "Завершенные",
    icon: "checkmark-i",
  },
  {
    id: 5,
    value: "rejected",
    name: "Отклоненные",
    icon: "close",
  },
];
const oneTab = ref(tabs[0]);
const appeals = ref([]);

const normalizeAppeal = (appeal) => ({
  id: appeal.id,
  description: appeal.description || "",
  category: appeal.category || "",
  priority: appeal.priority || "medium",
  status: appeal.status || "new",
  createdAt: appeal.createdAt,
  deadlineAt: appeal.deadlineAt,
  user: appeal.user || null,
  assignedEmployee: appeal.assignedEmployee || null,
});

const filteredAppeals = computed(() => {
  const priority = onePriority.value?.value || "";
  const status = oneTab.value?.value || "all";

  return appeals.value.filter((item) => {
    const matchesStatus = status === "all" ? true : item.status === status;
    const matchesPriority = priority ? item.priority === priority : true;
    const matchesSearch = search.value
      ? [item.description, item.category, item.user?.name, item.assignedEmployee?.name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search.value.toLowerCase())
      : true;

    return matchesStatus && matchesPriority && matchesSearch;
  });
});

const loadAppeals = async () => {
  const response = await api.client({
    url: "/appeals",
    method: "get",
    params: {
      role: "admin",
      search: search.value || undefined,
      status: oneTab.value?.value !== "all" ? oneTab.value.value : undefined,
      priority: onePriority.value?.value || undefined,
    },
  });

  appeals.value = (response?.data || response || []).map(normalizeAppeal);
};

const initialResponse = await useFetchSsr({
  url: "/appeals",
  method: "get",
  params: { role: "admin" },
});

appeals.value = (initialResponse?.data || initialResponse || []).map(normalizeAppeal);

useWatchDebounced(search, loadAppeals, { debounce: 350 });
watch([oneTab, onePriority], loadAppeals);
</script>

<style lang="scss" scoped>
.appeals {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }
  &__filter {
    display: flex;
    align-items: center;
    gap: $gap-md;
  }
}

@media (max-width: 625px) {
  .appeals {
    &__filter {
      flex-direction: column;
    }
    &__btn {
      width: 50%;
      margin-left: auto;
    }
  }
}
</style>
