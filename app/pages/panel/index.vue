<template>
  <section class="main">
    <div class="main__wrapper">
      <div class="main__header">
        <h2 class="main__title title-md">Общие данные</h2>
        <p class="main__subtitle">
          Сводка по всем обращениям, тепловая карта и последние записи
        </p>
      </div>

      <div
        class="main__boards"
        :class="{ 'main__boards--aside': !asideStore.isOpen }"
      >
        <ThePanelMainInfoBoard
          v-for="info in infoBoards"
          :key="info.id"
          :info="info"
        />
      </div>

      <div class="main__section">
        <div class="main__section-head">
          <h2 class="main__title title-md">Тепловая карта</h2>
          <p class="main__subtitle">
            {{ heatmapPoints.length }} точек из доступных обращений
          </p>
        </div>
        <UiHeatmap :points="heatmapPoints" />
      </div>

      <div class="main__section">
        <div class="main__section-head">
          <h3 class="main__title title-md">
            Последние обращения ({{ dashboardAppeals.length }})
          </h3>
        </div>
        <div
          class="main__cards"
          :class="{ 'main__cards--aside': !asideStore.isOpen }"
        >
          <ThePanelMainCard
            v-for="card in dashboardAppeals"
            :key="card.id"
            :card="card"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const asideStore = useAsideStore();
const api = useApi();
useSeo({ title: "Главная" });

definePageMeta({
  layout: "default",
  middlewares: ["auth"],
});

const dashboardMeta = ref({
  role: "",
  scopeLabel: "все",
  total: 0,
  completed: 0,
  active: 0,
  rejected: 0,
  statusCounts: {},
});

const heatmapPoints = ref([]);
const dashboardAppeals = ref([]);

const buildBoards = (summary) => [
  {
    id: 1,
    name: "Общее количество обращений",
    text: summary.total,
    icon: "circle-i",
    iconColor: "blue-500",
    bgColor: "",
    textColor: "",
    borderColor: "#0646FF",
  },
  {
    id: 2,
    name: "Выполненные обращения",
    text: summary.completed,
    icon: "checkmark-i",
    iconColor: "green-500",
    bgColor: "",
    textColor: "",
    borderColor: "#22C55E",
  },
  {
    id: 3,
    name: "В работе",
    text: summary.active,
    icon: "time-i",
    iconColor: "yellow-400",
    bgColor: "",
    textColor: "",
    borderColor: "#FFCC00",
  },
  {
    id: 4,
    name: "Отклоненные обращения",
    text: summary.rejected,
    icon: "close",
    iconColor: "red-300",
    bgColor: "",
    textColor: "",
    borderColor: "#FF5757",
  },
];

const infoBoards = computed(() => buildBoards(dashboardMeta.value));

const normalizeSummary = (payload) => ({
  role: payload?.role || "",
  scopeLabel: payload?.label || "все",
  total: payload?.total || 0,
  completed: payload?.completed || 0,
  active: payload?.active || 0,
  rejected: payload?.rejected || 0,
  statusCounts: payload?.statusCounts || {},
});

const normalizeDashboardAppeal = (appeal) => ({
  id: appeal.id,
  description: appeal.description || "",
  category: appeal.category || "",
  priority: appeal.priority || "medium",
  status: appeal.status || "new",
  location: appeal.location || {},
  photos: appeal.photos || [],
  createdAt: appeal.createdAt,
  deadlineAt: appeal.deadlineAt,
  assignedEmployee: appeal.assignedEmployee || null,
});

const loadDashboard = async () => {
  const [summaryResponse, heatmapResponse, appealsResponse] = await Promise.all(
    [
      api.client({ url: "/dashboard/summary", method: "get" }),
      api.client({ url: "/dashboard/heatmap", method: "get" }),
      api.client({
        url: "/dashboard/appeals",
        method: "get",
        params: { limit: 9 },
      }),
    ],
  );

  dashboardMeta.value = normalizeSummary(
    summaryResponse?.data || summaryResponse || {},
  );
  heatmapPoints.value = (heatmapResponse?.data || heatmapResponse || []).map(
    (point) => [Number(point?.[0]), Number(point?.[1])],
  );
  dashboardAppeals.value = (appealsResponse?.data || appealsResponse || []).map(
    normalizeDashboardAppeal,
  );
};

const initialSummary = await useFetchSsr({
  url: "/dashboard/summary",
  method: "get",
});

const initialHeatmap = await useFetchSsr({
  url: "/dashboard/heatmap",
  method: "get",
});

const initialAppeals = await useFetchSsr({
  url: "/dashboard/appeals",
  method: "get",
  params: { limit: 9 },
});

dashboardMeta.value = normalizeSummary(
  initialSummary?.data || initialSummary || {},
);
heatmapPoints.value = (initialHeatmap?.data || initialHeatmap || []).map(
  (point) => [Number(point?.[0]), Number(point?.[1])],
);
dashboardAppeals.value = (initialAppeals?.data || initialAppeals || []).map(
  normalizeDashboardAppeal,
);

onMounted(loadDashboard);
</script>

<style lang="scss" scoped>
.main {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }
  &__header,
  &__section-head {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  &__subtitle {
    color: $surface-500;
    font-size: 14px;
  }
  &__section {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }
  &__boards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $gap-xl;
  }
  &__cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $gap-xl;
  }
}

@media (max-width: 1200px) {
  .main {
    &__boards--aside {
      grid-template-columns: repeat(2, 1fr);
    }
    &__cards--aside {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 1000px) {
  .main {
    &__boards,
    &__cards {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 625px) {
  .main {
    &__boards,
    &__cards {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
</style>
