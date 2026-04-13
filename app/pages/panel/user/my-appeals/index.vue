<template>
  <section class="my-appeals">
    <div class="my-appeals__wrapper">
      <UiTabs :tabs="tabs" v-model="oneTab" :is-scroll="true" />
      <h2 class="my-appeals__title title-md">Мои обращения ({{ filteredCards.length }})</h2>

      <div class="my-appeals__cards">
        <ThePanelUserMyAppealsCard v-for="card in filteredCards" :key="card.id" :card="card" />
      </div>

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
useSeo({ title: "Мои обращения" });

const tabs = [
  {
    id: 1,
    value: "all",
    name: "Все",
    icon: "",
  },
  {
    id: 2,
    value: "new",
    name: "Новые",
    icon: "time-i",
  },
  {
    id: 3,
    value: "moderation",
    name: "Модерация",
    icon: "time-i",
  },
  {
    id: 4,
    value: "processing",
    name: "В работе",
    icon: "time-i",
  },
  {
    id: 5,
    value: "needs_revision",
    name: "Доработка",
    icon: "time-i",
  },
  {
    id: 6,
    value: "completed",
    name: "Завершённые",
    icon: "checkmark-i",
  },
  {
    id: 7,
    value: "rated",
    name: "Оценённые",
    icon: "checkmark-i",
  },
  {
    id: 8,
    value: "rejected",
    name: "Отклоненные",
    icon: "close",
  },
];
const oneTab = ref(tabs[0]);
const cards = ref([]);
const page = ref(Number(route.query.page || 1));
const pagination = ref({
  totalPages: 1,
  total: 0,
});

const filteredCards = computed(() => cards.value);

const normalizeAppeal = (appeal) => ({
  id: appeal.id,
  description: appeal.description || "",
  category: appeal.category || "",
  subCategory: appeal.subCategory || "",
  priority: appeal.priority || "medium",
  status: appeal.status || "new",
  location: appeal.location || {},
  photos: appeal.photos || [],
  createdAt: appeal.createdAt,
  deadlineAt: appeal.deadlineAt,
});

const loadAppeals = async () => {
  const tabValue = oneTab.value?.value || "all";
  const response = await api.client({
    url: "/appeals",
    method: "get",
    params: {
      role: "user",
      page: page.value,
      limit: 9,
      statusGroup: tabValue === "all" ? undefined : tabValue,
    },
  });

  cards.value = (response?.data || response || []).map(normalizeAppeal);
  pagination.value = {
    totalPages: Number(response?.meta?.totalPages || response?.data?.meta?.totalPages || 1),
    total: Number(response?.meta?.total || response?.data?.meta?.total || 0),
  };
};

const initialResponse = await useFetchSsr({
  url: "/appeals",
  method: "get",
  params: { role: "user", page: page.value, limit: 9 },
});

cards.value = (initialResponse?.data || initialResponse || []).map(normalizeAppeal);
pagination.value = {
  totalPages: Number(initialResponse?.meta?.totalPages || initialResponse?.data?.meta?.totalPages || 1),
  total: Number(initialResponse?.meta?.total || initialResponse?.data?.meta?.total || 0),
};

onMounted(loadAppeals);
watch(page, loadAppeals);
watch(oneTab, () => {
  page.value = 1;
  loadAppeals();
});
</script>

<style lang="scss" scoped>
.my-appeals {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }
  &__cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $gap-md;
  }
}
</style>
