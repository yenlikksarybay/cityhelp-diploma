<template>
  <section class="user-detail">
    <div class="user-detail__wrapper">
      <ThePanelAdminDetailDetailHeader
        :title="userName"
        subtitle="Информация о пользователе и его обращениях"
        button-label="К списку пользователей"
        button-href="/panel/admin/users"
        :avatar-src="userAvatarSrc"
        :avatar-initials="userInitials"
      />

      <ThePanelAdminDetailDetailStats :stats="statsCards" />

      <ThePanelAdminDetailDetailInfoGrid :items="infoItems" />

      <ThePanelAdminDetailDetailAppealsSection
        title="Обращения пользователя"
        :rows="appeals"
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
useSeo({ title: "Пользователь" });

const user = ref({});
const appeals = ref([]);
const page = ref(Number(route.query.page || 1));
const pagination = ref({
  totalPages: 1,
  total: 0,
});
const stats = ref({
  totalAppeals: 0,
  openAppeals: 0,
  closedAppeals: 0,
  averageRating: 0,
});

const userName = computed(() => {
  return (
    user.value?.name ||
    `${user.value?.firstName || ""} ${user.value?.lastName || ""}`.trim() ||
    "Пользователь"
  );
});

const userAvatarSrc = computed(() => user.value?.avatar?.url || user.value?.avatarUrl || "");
const userInitials = computed(() => {
  const first = user.value?.firstName?.trim()?.[0] || "";
  const last = user.value?.lastName?.trim()?.[0] || "";
  if (first || last) {
    return `${first}${last}`.toUpperCase();
  }

  return userName.value?.[0]?.toUpperCase() || "";
});

const statsCards = computed(() => [
  { key: "total", value: stats.value.totalAppeals, label: "Всего обращений" },
  { key: "open", value: stats.value.openAppeals, label: "Открытые", valueClass: "is-success" },
  { key: "closed", value: stats.value.closedAppeals, label: "Закрытые", valueClass: "is-danger" },
  { key: "rating", value: formatRating(stats.value.averageRating), label: "Средняя оценка", valueClass: "is-accent" },
]);

const infoItems = computed(() => [
  { key: "phone", label: "Телефон", value: formatKzPhone(user.value.phone || "") || "—" },
  { key: "email", label: "E-mail", value: user.value.email || "—" },
  { key: "createdAt", label: "Дата регистрации", value: formatDateToDots(user.value.createdAt) || "—" },
  { key: "role", label: "Роль", value: user.value.role || "user" },
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

const loadUser = async () => {
  const response = await api.client({
    url: `/admin/users/${route.params.id}`,
    method: "get",
    params: {
      page: page.value,
      limit: 12,
    },
  });

  user.value = response?.data?.user || response?.user || {};
  stats.value = response?.data?.stats || response?.stats || stats.value;
  appeals.value = (response?.data?.appeals || response?.appeals || []).map(normalizeAppeal);
  pagination.value = {
    totalPages: Number(response?.data?.meta?.totalPages || response?.meta?.totalPages || 1),
    total: Number(response?.data?.meta?.total || response?.meta?.total || 0),
  };
};

const initialResponse = await useFetchSsr({
  url: `/admin/users/${route.params.id}`,
  method: "get",
  params: {
    page: page.value,
    limit: 12,
  },
});

user.value = initialResponse?.data?.user || initialResponse?.user || {};
stats.value = initialResponse?.data?.stats || initialResponse?.stats || stats.value;
appeals.value = (initialResponse?.data?.appeals || initialResponse?.appeals || []).map(normalizeAppeal);
pagination.value = {
  totalPages: Number(initialResponse?.data?.meta?.totalPages || initialResponse?.meta?.totalPages || 1),
  total: Number(initialResponse?.data?.meta?.total || initialResponse?.meta?.total || 0),
};

watch(page, loadUser);
</script>

<style lang="scss" scoped>
.user-detail {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }
}
</style>
