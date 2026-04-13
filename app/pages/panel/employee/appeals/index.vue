<template>
  <section class="appeals">
    <div class="appeals__wrapper">
      <div class="appeals__stats">
        <div class="appeals__stat">
          <p class="appeals__stat-value">{{ stats.total }}</p>
          <p class="appeals__stat-label">Всего обращений</p>
        </div>
        <div class="appeals__stat">
          <p class="appeals__stat-value">{{ stats.positive }}</p>
          <p class="appeals__stat-label">Положительные оценки</p>
        </div>
        <div class="appeals__stat">
          <p class="appeals__stat-value">{{ stats.negative }}</p>
          <p class="appeals__stat-label">Отрицательные оценки</p>
        </div>
        <div class="appeals__stat">
          <div class="appeals__stat-head">
            <p class="appeals__stat-value">{{ stats.average }}</p>
            <span
              class="appeals__stat-info"
              tabindex="0"
              aria-label="Формула расчёта средней оценки"
            >
              <UiIcon
                icon="info-circle-i"
                size="size-20"
                color="secondary-accent"
              />
              <span class="appeals__stat-tooltip">
                Средняя оценка = сумма всех оценок / количество оценённых
                обращений
              </span>
            </span>
          </div>
          <p class="appeals__stat-label">Средняя оценка</p>
        </div>
      </div>

      <div class="appeals__box">
        <h2 class="appeals__title title-md title-point">Для вас</h2>
        <ThePanelEmployeeAppealsTable :rows="assignedToMe" />
      </div>

      <hr class="appeals__hr" />

      <div class="appeals__box">
        <h2 class="appeals__title title-md title-point">Активные</h2>
        <ThePanelEmployeeAppealsTable :rows="activeAppeals" />
      </div>

      <hr class="appeals__hr" />

      <div class="appeals__box">
        <h2 class="appeals__title title-md title-point">Завершенные</h2>
        <ThePanelEmployeeAppealsTable :rows="completedAppeals" />
      </div>

      <hr class="appeals__hr" />

      <div class="appeals__box">
        <h2 class="appeals__title title-md title-point">Отклоненные</h2>
        <ThePanelEmployeeAppealsTable :rows="rejectedAppeals" />
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
useSeo({ title: "Обращений" });

const appeals = ref([]);
const page = ref(Number(route.query.page || 1));
const pagination = ref({
  totalPages: 1,
  total: 0,
});

const normalizeAppeal = (appeal) => ({
  id: appeal.id,
  description: appeal.description || "",
  category: appeal.category || "",
  subCategory: appeal.subCategory || "",
  priority: appeal.priority || "medium",
  status: appeal.status || "new",
  deadlineAt: appeal.deadlineAt,
  createdAt: appeal.createdAt,
  location: appeal.location || {},
  photos: appeal.photos || [],
  assignedEmployee: appeal.assignedEmployee || null,
  rating: appeal.rating || null,
  closedAt: appeal.closedAt || null,
  employeeName: appeal.employeeName || "",
});

const assignedToMe = computed(() =>
  appeals.value.filter((item) => item.status === "new"),
);

const activeAppeals = computed(() =>
  appeals.value.filter((item) =>
    ["processing", "needs_revision"].includes(item.status),
  ),
);

const completedAppeals = computed(() =>
  appeals.value.filter((item) => ["completed", "rated"].includes(item.status)),
);

const rejectedAppeals = computed(() =>
  appeals.value.filter((item) => ["rejected"].includes(item.status)),
);

const stats = computed(() => {
  const ratedAppeals = appeals.value.filter(
    (item) => item.rating?.score !== null && item.rating?.score !== undefined,
  );
  const positive = ratedAppeals.filter(
    (item) => Number(item.rating?.score) >= 4,
  ).length;
  const negative = ratedAppeals.filter(
    (item) => Number(item.rating?.score) <= 2,
  ).length;
  const average = ratedAppeals.length
    ? (
        ratedAppeals.reduce(
          (sum, item) => sum + Number(item.rating?.score || 0),
          0,
        ) / ratedAppeals.length
      ).toFixed(1)
    : "—";

  return {
    total: appeals.value.length,
    positive,
    negative,
    average,
  };
});

const loadAppeals = async () => {
  const response = await api.client({
    url: "/appeals",
    method: "get",
    params: { role: "employee", page: page.value, limit: 12 },
  });

  appeals.value = (response?.data || response || []).map(normalizeAppeal);
  pagination.value = {
    totalPages: Number(
      response?.meta?.totalPages || response?.data?.meta?.totalPages || 1,
    ),
    total: Number(response?.meta?.total || response?.data?.meta?.total || 0),
  };
};

const initialResponse = await useFetchSsr({
  url: "/appeals",
  method: "get",
  params: { role: "employee", page: page.value, limit: 12 },
});

appeals.value = (initialResponse?.data || initialResponse || []).map(
  normalizeAppeal,
);
pagination.value = {
  totalPages: Number(
    initialResponse?.meta?.totalPages ||
      initialResponse?.data?.meta?.totalPages ||
      1,
  ),
  total: Number(
    initialResponse?.meta?.total || initialResponse?.data?.meta?.total || 0,
  ),
};

onMounted(loadAppeals);
watch(page, loadAppeals);
</script>

<style lang="scss" scoped>
.appeals {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }
  &__stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: $gap-md;
  }
  &__stat {
    padding: $padding-md;
    border-radius: $border-r-md;
    background-color: $surface-100;
    box-shadow: $box-shadow;
    display: flex;
    flex-direction: column;
    gap: $gap-xs;
  }
  &__stat-value {
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
  }
  &__stat-head {
    display: flex;
    align-items: center;
    gap: $gap-sm;
  }
  &__stat-info {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: help;
    position: relative;
    outline: none;

    &:hover .appeals__stat-tooltip,
    &:focus-visible .appeals__stat-tooltip {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
  }
  &__stat-tooltip {
    position: absolute;
    top: calc(100% + 10px);
    transform: translateX(-51%) translateY(-6px);
    min-width: 250px;
    max-width: 300px;
    padding: 10px 12px;
    border-radius: $border-r-md;
    background: $surface-600;
    color: $white;
    font-size: 13px;
    line-height: 150%;
    box-shadow: $box-shadow;
    opacity: 0;
    pointer-events: none;
    transition: 0.18s ease;
    z-index: 3;

    &::before {
      content: "";
      position: absolute;
      top: -5px;
      left: 51.8%;
      width: 10px;
      height: 10px;
      transform: translateX(-100%) rotate(45deg);
      background: $surface-600;
    }
  }
  &__stat-label {
    color: $surface-400;
  }
  &__box {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
    padding: $padding-md;
    background-color: $surface-100;
    border-radius: $border-r-md;
    box-shadow: $box-shadow;
  }
  &__hr {
    border: 1.4px dashed $secondary-accent;
    border-radius: $border-r-md;
    position: relative;
    &::after {
      position: absolute;
      content: "1";
      top: 0;
      left: 50%;
      width: 20px;
      height: 20px;
      background-color: $secondary-accent;
      border-radius: 50%;
    }
  }
}

@media (max-width: 900px) {
  .appeals {
    &__stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

@media (max-width: 540px) {
  .appeals {
    &__stats {
      grid-template-columns: 1fr;
    }
  }
}
</style>
