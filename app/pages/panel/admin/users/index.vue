<template>
  <section class="users">
    <div class="users__wrapper">
      <h2 class="users__title title-md">Список всех пользователей</h2>

      <div class="users__filters">
        <UiInput
          before-icon="lupa-i"
          icon-size="size-20"
          placeholder="Поиск по имени или телефону"
          v-model="search"
        />
      </div>

      <ThePanelAdminUsersTable :rows="items" :is-loading="isLoading" />
    </div>
  </section>
</template>

<script setup>
const items = ref([]);
const search = ref("");
const isLoading = ref(false);

const initialResponse = await useFetchSsr({
  url: "/admin/users",
  method: "get",
  params: { role: "user" },
});

items.value = initialResponse?.data || [];

const fetchUsers = async () => {
  try {
    isLoading.value = true;
    const res = await useApi().client({
      url: "/admin/users",
      method: "get",
      params: {
        role: "user",
        search: search.value || undefined,
      },
    });

    items.value = res?.data || [];
  } catch (error) {
    useNotify({
      title: "Ошибка",
      text: error?.statusMessage || error?.data?.message || "Не удалось загрузить список",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

useWatchDebounced(search, () => {
  fetchUsers();
}, { debounce: 350 });

useSeo({ title: "Пользователи" });
</script>

<style lang="scss" scoped>
.users {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }
  &__filters {
    display: flex;
    gap: $gap-md;
    align-content: center;
  }
}
</style>
