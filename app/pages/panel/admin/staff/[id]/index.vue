<template>
  <section class="staff-detail">
    <div class="staff-detail__wrapper">
      <ThePanelAdminDetailDetailHeader
        :title="employeeName"
        subtitle="Информация о сотруднике и его обращениях"
        button-label="К списку сотрудников"
        button-href="/panel/admin/staff"
        :avatar-src="employeeAvatarSrc"
        :avatar-initials="employeeInitials"
      />

      <ThePanelAdminDetailDetailStats :stats="statsCards" />

      <ThePanelAdminDetailDetailInfoGrid :items="infoItems" />

      <ThePanelAdminDetailDetailAppealsSection
        title="Обращения сотрудника"
        :rows="appeals"
        v-model="oneTab"
        :tabs="tabs"
        :page="page"
        :total-pages="pagination.totalPages"
        @update:page="page = $event"
      />
    </div>
  </section>
</template>

<script setup>
import ThePanelAdminDetailDetailHeader from "~/components/The/Panel/Admin/Detail/DetailHeader.vue";
import ThePanelAdminDetailDetailStats from "~/components/The/Panel/Admin/Detail/DetailStats.vue";
import ThePanelAdminDetailDetailInfoGrid from "~/components/The/Panel/Admin/Detail/DetailInfoGrid.vue";
import ThePanelAdminDetailDetailAppealsSection from "~/components/The/Panel/Admin/Detail/DetailAppealsSection.vue";

const api = useApi();
const route = useRoute();
useSeo({ title: "Сотрудник" });

const employee = ref({});
const appeals = ref([]);
const page = ref(Number(route.query.page || 1));
const oneTab = ref({
  id: 1,
  value: "all",
  name: "Все",
  icon: "",
});
const pagination = ref({
  totalPages: 1,
  total: 0,
});
const stats = ref({
  totalAppeals: 0,
  positiveRatingCount: 0,
  negativeRatingCount: 0,
  averageRating: 0,
  openAppeals: 0,
  closedAppeals: 0,
});

const tabs = [
  { id: 1, value: "all", name: "Все", icon: "" },
  { id: 2, value: "new", name: "Новые", icon: "time-i" },
  { id: 3, value: "moderation", name: "Модерация", icon: "time-i" },
  { id: 4, value: "processing", name: "В работе", icon: "time-i" },
  { id: 5, value: "needs_revision", name: "Доработка", icon: "time-i" },
  { id: 6, value: "completed", name: "Завершённые", icon: "checkmark-i" },
  { id: 7, value: "rated", name: "Оценённые", icon: "checkmark-i" },
  { id: 8, value: "rejected", name: "Отклонённые", icon: "close" },
];

const employeeName = computed(() => {
  return (
    employee.value?.name ||
    `${employee.value?.firstName || ""} ${employee.value?.lastName || ""}`.trim() ||
    "Сотрудник"
  );
});

const employeeAvatarSrc = computed(() => employee.value?.avatar?.url || employee.value?.avatarUrl || "");
const employeeInitials = computed(() => {
  const first = employee.value?.firstName?.trim()?.[0] || "";
  const last = employee.value?.lastName?.trim()?.[0] || "";
  if (first || last) {
    return `${first}${last}`.toUpperCase();
  }

  return employeeName.value?.[0]?.toUpperCase() || "";
});

const statsCards = computed(() => [
  { key: "total", value: stats.value.totalAppeals, label: "Всего обращений" },
  { key: "positive", value: stats.value.positiveRatingCount, label: "Положительные", valueClass: "is-success" },
  { key: "negative", value: stats.value.negativeRatingCount, label: "Отрицательные", valueClass: "is-danger" },
  { key: "rating", value: formatRating(stats.value.averageRating), label: "Рейтинг", valueClass: "is-accent" },
]);

const infoItems = computed(() => [
  { key: "phone", label: "Телефон", value: formatKzPhone(employee.value.phone || "") || "—" },
  { key: "email", label: "E-mail", value: employee.value.email || "—" },
  { key: "open", label: "Активные", value: stats.value.openAppeals },
  { key: "closed", label: "Закрытые", value: stats.value.closedAppeals },
]);

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

const formatRating = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }

  return Number(value).toFixed(1);
};

const loadEmployee = async () => {
  const response = await api.client({
    url: `/admin/staff/${route.params.id}`,
    method: "get",
    params: {
      page: page.value,
      limit: 12,
      statusGroup: oneTab.value?.value || "all",
    },
  });

  employee.value = response?.data?.employee || response?.employee || {};
  stats.value = response?.data?.stats || response?.stats || stats.value;
  appeals.value = (response?.data?.appeals || response?.appeals || []).map(normalizeAppeal);
  pagination.value = {
    totalPages: Number(response?.data?.meta?.totalPages || response?.meta?.totalPages || 1),
    total: Number(response?.data?.meta?.total || response?.meta?.total || 0),
  };
};

const initialResponse = await useFetchSsr({
  url: `/admin/staff/${route.params.id}`,
  method: "get",
  params: {
    page: page.value,
    limit: 12,
    statusGroup: oneTab.value?.value || "all",
  },
});

employee.value = initialResponse?.data?.employee || initialResponse?.employee || {};
stats.value = initialResponse?.data?.stats || initialResponse?.stats || stats.value;
appeals.value = (initialResponse?.data?.appeals || initialResponse?.appeals || []).map(normalizeAppeal);
pagination.value = {
  totalPages: Number(initialResponse?.data?.meta?.totalPages || initialResponse?.meta?.totalPages || 1),
  total: Number(initialResponse?.data?.meta?.total || initialResponse?.meta?.total || 0),
};

watch(page, loadEmployee);
watch(oneTab, () => {
  page.value = 1;
  loadEmployee();
});
</script>

<style lang="scss" scoped>
.staff-detail {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }
}
</style>
