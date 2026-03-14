<template>
  <section class="staff">
    <div class="staff__wrapper">
      <h2 class="staff__title title-md">Список всех работников</h2>

      <div class="staff__filters">
        <UiInput
          before-icon="lupa-i"
          icon-size="size-20"
          placeholder="Поиск по имени"
          v-model="search"
        />
      </div>

      <ThePanelAdminStaffTable />
    </div>
  </section>
</template>

<script setup>
const search = ref("");
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
