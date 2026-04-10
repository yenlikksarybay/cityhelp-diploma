<template>
  <section class="appeals">
    <div class="appeals__wrapper">
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
    </div>
  </section>
</template>

<script setup>
const api = useApi();
useSeo({ title: "Обращений" });

const appeals = ref([]);

const normalizeAppeal = (appeal) => ({
  id: appeal.id,
  description: appeal.description || "",
  category: appeal.category || "",
  priority: appeal.priority || "medium",
  status: appeal.status || "new",
  deadlineAt: appeal.deadlineAt,
  createdAt: appeal.createdAt,
  location: appeal.location || {},
  photos: appeal.photos || [],
  assignedEmployee: appeal.assignedEmployee || null,
});

const assignedToMe = computed(() =>
  appeals.value.filter((item) =>
    ["new", "moderation"].includes(item.status),
  ),
);

const activeAppeals = computed(() =>
  appeals.value.filter((item) => ["processing", "needs_revision"].includes(item.status)),
);

const completedAppeals = computed(() =>
  appeals.value.filter((item) => ["completed", "rated"].includes(item.status)),
);

const rejectedAppeals = computed(() =>
  appeals.value.filter((item) => ["rejected"].includes(item.status)),
);

const loadAppeals = async () => {
  const response = await api.client({
    url: "/appeals",
    method: "get",
    params: { role: "employee" },
  });

  appeals.value = (response?.data || response || []).map(normalizeAppeal);
};

const initialResponse = await useFetchSsr({
  url: "/appeals",
  method: "get",
  params: { role: "employee" },
});

appeals.value = (initialResponse?.data || initialResponse || []).map(normalizeAppeal);

onMounted(loadAppeals);
</script>

<style lang="scss" scoped>
.appeals {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
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
</style>
