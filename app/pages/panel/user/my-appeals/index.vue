<template>
  <section class="my-appeals">
    <div class="my-appeals__wrapper">
      <UiTabs :tabs="tabs" v-model="oneTab" :is-scroll="true" />
      <h2 class="my-appeals__title title-md">Мои обращения ({{ filteredCards.length }})</h2>

      <div class="my-appeals__cards">
        <ThePanelUserMyAppealsCard v-for="card in filteredCards" :key="card.id" :card="card" />
      </div>
    </div>
  </section>
</template>

<script setup>
const api = useApi();
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
    value: "solved",
    name: "Решённые",
    icon: "checkmark-i",
  },
  {
    id: 3,
    value: "processing",
    name: "В процессе",
    icon: "time-i",
  },
  {
    id: 4,
    value: "rejected",
    name: "Отклоненные",
    icon: "close",
  },
];
const oneTab = ref(tabs[0]);
const cards = ref([]);

const statusFilterMap = computed(() => ({
  all: null,
  solved: ["completed", "rated"],
  processing: ["new", "moderation", "processing", "needs_revision"],
  rejected: ["rejected"],
}));

const filteredCards = computed(() => {
  const status = oneTab.value?.value || "all";
  const allowed = statusFilterMap.value[status];

  if (!allowed) return cards.value;
  return cards.value.filter((card) => allowed.includes(card.status));
});

const normalizeAppeal = (appeal) => ({
  id: appeal.id,
  description: appeal.description || "",
  category: appeal.category || "",
  priority: appeal.priority || "medium",
  status: appeal.status || "new",
  location: appeal.location || {},
  photos: appeal.photos || [],
  createdAt: appeal.createdAt,
  deadlineAt: appeal.deadlineAt,
});

const loadAppeals = async () => {
  const response = await api.client({
    url: "/appeals",
    method: "get",
    params: { role: "user" },
  });

  cards.value = (response?.data || response || []).map(normalizeAppeal);
};

const initialResponse = await useFetchSsr({
  url: "/appeals",
  method: "get",
  params: { role: "user" },
});

cards.value = (initialResponse?.data || initialResponse || []).map(normalizeAppeal);

onMounted(loadAppeals);
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
