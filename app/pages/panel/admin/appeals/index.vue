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

      <UiPagination
        v-if="pagination.totalPages > 1"
        v-model="page"
        :total="pagination.totalPages"
      />
    </div>
  </section>
</template>

<script setup>
const api = useApi();
const route = useRoute();
useSeo({ title: "Список обращений" });

const search = ref("");
const page = ref(Number(route.query.page || 1));
const pagination = ref({
  totalPages: 1,
  total: 0,
});
const priorities = [
  {
    id: 0,
    value: "",
    name: "Все",
  },
  {
    id: 1,
    value: "urgent",
    name: "Срочный",
  },
  {
    id: 2,
    value: "high",
    name: "Высокий",
  },
  {
    id: 3,
    value: "medium",
    name: "Средний",
  },
  { id: 4, value: "low", name: "Низкий" },
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
    value: "needs_revision",
    name: "На доработке",
    icon: "time-i",
  },
  {
    id: 5,
    value: "completed",
    name: "Завершенные",
    icon: "checkmark-i",
  },
  {
    id: 6,
    value: "rated",
    name: "Оцененные",
    icon: "checkmark-i",
  },
  {
    id: 7,
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
  subCategory: appeal.subCategory || "",
  priority: appeal.priority || "medium",
  status: appeal.status || "new",
  createdAt: appeal.createdAt,
  deadlineAt: appeal.deadlineAt,
  closedAt: appeal.closedAt,
  location: appeal.location || {},
  user: appeal.user || null,
  assignedEmployee: appeal.assignedEmployee || null,
  employeeName: appeal.employeeName || "",
  rating: appeal.rating || null,
});

const filteredAppeals = computed(() => appeals.value);

const loadAppeals = async () => {
  const response = await api.client({
    url: "/appeals",
    method: "get",
    params: {
      role: "admin",
      search: search.value || undefined,
      status: oneTab.value?.value !== "all" ? oneTab.value.value : undefined,
      priority: onePriority.value?.value || undefined,
      page: page.value,
      limit: 12,
    },
  });

  appeals.value = (response?.data || response || []).map(normalizeAppeal);
  pagination.value = {
    totalPages: Number(response?.meta?.totalPages || response?.data?.meta?.totalPages || 1),
    total: Number(response?.meta?.total || response?.data?.meta?.total || 0),
  };
};

const initialResponse = await useFetchSsr({
  url: "/appeals",
  method: "get",
  params: { role: "admin", page: page.value, limit: 12 },
});

appeals.value = (initialResponse?.data || initialResponse || []).map(normalizeAppeal);
pagination.value = {
  totalPages: Number(initialResponse?.meta?.totalPages || initialResponse?.data?.meta?.totalPages || 1),
  total: Number(initialResponse?.meta?.total || initialResponse?.data?.meta?.total || 0),
};

useWatchDebounced(search, loadAppeals, { debounce: 350 });
watch(search, () => {
  page.value = 1;
});
watch([oneTab, onePriority], () => {
  if (page.value === 1) {
    loadAppeals();
    return;
  }

  page.value = 1;
});
watch(page, loadAppeals);
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
