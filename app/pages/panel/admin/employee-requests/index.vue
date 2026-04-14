<template>
  <section class="employee-requests">
    <div class="employee-requests__wrapper">
      <div class="employee-requests__head">
        <div>
          <h2 class="title-md">Заявки на сотрудничество</h2>
          <p class="employee-requests__subtitle">
            Здесь администрация подтверждает или отклоняет переход пользователя
            в роль сотрудника.
          </p>
        </div>

        <UiTabs :tabs="tabs" v-model="selectedTab" :is-scroll="true" />
      </div>

      <div class="employee-requests__table-wrap">
        <table class="employee-requests__table">
          <thead>
            <tr>
              <th>Пользователь</th>
              <th>Контакты</th>
              <th>Статус</th>
              <th>Дата заявки</th>
              <th>Комментарий</th>
              <th>Действие</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="isLoading">
              <td colspan="6" class="employee-requests__empty">
                Загрузка заявок...
              </td>
            </tr>
            <tr v-else-if="!requests.length">
              <td colspan="6" class="employee-requests__empty">
                Заявок по выбранному фильтру пока нет.
              </td>
            </tr>
            <tr v-for="request in requests" :key="request.id">
              <td>
                <div class="employee-requests__user">
                  <div class="employee-requests__avatar">
                    <img
                      v-if="request.user?.avatarUrl"
                      :src="request.user.avatarUrl"
                      :alt="request.user?.name || 'Пользователь'"
                    />
                    <span v-else>{{ getInitials(request.user) }}</span>
                  </div>

                  <div>
                    <p class="employee-requests__name">
                      {{ request.user?.name || "—" }}
                    </p>
                    <NuxtLink
                      v-if="request.user?.id"
                      class="employee-requests__link"
                      :to="`/panel/admin/users/${request.user.id}`"
                    >
                      Открыть профиль
                    </NuxtLink>
                  </div>
                </div>
              </td>
              <td>
                <p>{{ request.user?.email || "—" }}</p>
                <p class="employee-requests__muted">
                  {{ formatKzPhone(request.user?.phone || "") || "—" }}
                </p>
              </td>
              <td>{{ getStatusLabel(request.status) }}</td>
              <td>{{ formatDateToDots(request.createdAt) || "—" }}</td>
              <td class="employee-requests__comment">
                {{ request.adminComment || request.message || "—" }}
              </td>
              <td>
                <div
                  v-if="request.status === 'pending'"
                  class="employee-requests__actions"
                >
                  <UiButton
                    class="primary-btn employee-requests__button"
                    label="Принять"
                    :disabled="processingId === request.id"
                    @action="reviewRequest(request, 'approved')"
                  />
                  <UiButton
                    class="secondary-btn employee-requests__button"
                    label="Отклонить"
                    :disabled="processingId === request.id"
                    @action="reviewRequest(request, 'rejected')"
                  />
                </div>
                <p v-else class="employee-requests__muted">
                  {{
                    request.reviewedAt
                      ? `Обработано: ${formatDateToDots(request.reviewedAt)}`
                      : "Обработано"
                  }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
const api = useApi();
useSeo({ title: "Заявки на сотрудничество" });

const selectedTab = ref({
  id: 1,
  value: "pending",
  name: "На рассмотрении",
  icon: "time-i",
});
const requests = ref([]);
const meta = ref({ statusCounts: {}, total: 0 });
const isLoading = ref(false);
const processingId = ref("");

const baseTabs = [
  { id: 1, value: "pending", name: "На рассмотрении", icon: "time-i" },
  { id: 2, value: "approved", name: "Одобренные", icon: "checkmark-i" },
  { id: 3, value: "rejected", name: "Отклонённые", icon: "close" },
  { id: 4, value: "all", name: "Все", icon: "" },
];

const buildTabs = (payload = {}) => {
  const counts = payload?.statusCounts || {};
  const total = Number(payload?.total || 0);

  return baseTabs.map((tab) => ({
    ...tab,
    count: tab.value === "all" ? total : Number(counts?.[tab.value] || 0),
  }));
};

const normalizeRequests = (items = []) => {
  requests.value = Array.isArray(items) ? items : [];
};

const loadRequests = async () => {
  try {
    isLoading.value = true;
    const response = await api.client({
      url: "/admin/employee-requests",
      method: "get",
      params: {
        status: selectedTab.value?.value || "pending",
      },
    });

    normalizeRequests(response?.data || []);
    meta.value = response?.meta || { statusCounts: {}, total: 0 };
    tabs.value = buildTabs(meta.value);
  } catch (error) {
    useNotify({
      title: "Не удалось загрузить заявки",
      text: error?.statusMessage || "Попробуйте обновить страницу.",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const initialResponse = await useFetchSsr({
  url: "/admin/employee-requests",
  method: "get",
  params: {
    status: selectedTab.value?.value || "pending",
  },
});

normalizeRequests(initialResponse?.data || []);
meta.value = initialResponse?.meta || { statusCounts: {}, total: 0 };
const tabs = ref(buildTabs(meta.value));

const reviewRequest = async (request, status) => {
  if (!request?.id || processingId.value) return;

  try {
    processingId.value = request.id;
    await api.client({
      url: `/admin/employee-requests/${request.id}`,
      method: "patch",
      body: {
        status,
      },
    });

    useNotify({
      title: status === "approved" ? "Заявка одобрена" : "Заявка отклонена",
      text:
        status === "approved"
          ? "Пользователь переведён в роль сотрудника."
          : "Пользователь остался в роли user и сможет отправить новую заявку.",
      status: "success",
    });

    await loadRequests();
  } catch (error) {
    useNotify({
      title: "Не удалось обработать заявку",
      text: error?.statusMessage || "Попробуйте ещё раз.",
      status: "error",
    });
  } finally {
    processingId.value = "";
  }
};

const getInitials = (user) => {
  const first = user?.firstName?.trim()?.[0] || "";
  const last = user?.lastName?.trim()?.[0] || "";
  return (
    `${first}${last}`.trim().toUpperCase() ||
    user?.name?.[0]?.toUpperCase() ||
    "U"
  );
};

const getStatusLabel = (status) => {
  if (status === "pending") return "На рассмотрении";
  if (status === "approved") return "Одобрено";
  if (status === "rejected") return "Отклонено";
  return "—";
};

watch(selectedTab, loadRequests);
</script>

<style lang="scss" scoped>
.employee-requests {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xl;
  }

  &__head {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }

  &__subtitle {
    color: $surface-500;
    margin-top: 6px;
    line-height: 1.45;
  }

  &__table-wrap {
    overflow-x: auto;
    border-radius: $border-r-lg;
    background: $white;
    box-shadow: $box-shadow;
  }

  &__link {
    text-decoration: underline;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      padding: 18px 16px;
      text-align: left;
      // vertical-align: top;
      border-bottom: 1px solid $surface-150;
    }

    th {
      color: $surface-500;
      font-size: 14px;
      font-weight: 600;
    }
  }

  &__user {
    display: flex;
    align-items: center;
    gap: $gap-md;
  }

  &__avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    overflow: hidden;
    background: $secondary-accent;
    color: $white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__name {
    font-weight: 700;
  }

  &__link {
    color: $secondary-accent;
    font-size: 14px;
  }

  &__muted {
    color: $surface-500;
    font-size: 14px;
  }

  &__comment {
    min-width: 240px;
    max-width: 340px;
    color: $surface-500;
    line-height: 1.45;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: $gap-sm;
    min-width: 150px;
  }

  &__button {
    width: 100%;
  }

  &__empty {
    text-align: center;
    color: $surface-500;
    padding: 32px 16px;
  }
}
</style>
