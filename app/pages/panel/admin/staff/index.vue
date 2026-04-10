<template>
  <section class="staff">
    <div class="staff__wrapper">
      <h2 class="staff__title title-md">Список всех работников</h2>

      <div class="staff__filters">
        <UiInput
          before-icon="lupa-i"
          icon-size="size-20"
          placeholder="Поиск по имени или телефону"
          v-model="search"
        />
      </div>

      <ThePanelAdminStaffTable :rows="items" :is-loading="isLoading" />
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
  params: { role: "employee" },
});

items.value = initialResponse?.data || [];

const fetchUsers = async () => {
  try {
    isLoading.value = true;
    const res = await useApi().client({
      url: "/admin/users",
      method: "get",
      params: {
        role: "employee",
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

useSeo({ title: "Сотрудники" });
</script>

<style lang="scss" scoped>
.staff {
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
