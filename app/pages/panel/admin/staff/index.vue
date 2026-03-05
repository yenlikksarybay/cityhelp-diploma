<template>
  <section class="staff">
    <div class="staff__wrapper">
      <h2 class="staff__title title-md">Список всех пользователей</h2>

      <ThePanelAdminStaffTable />
    </div>
  </section>
</template>

<script setup>
useSeo({ title: "Сотрудники" });
</script>

<style lang="scss" scoped>
.staff {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }
}
</style>
