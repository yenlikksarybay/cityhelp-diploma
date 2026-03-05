<template>
  <section class="users">
    <div class="users__wrapper">
      <h2 class="users__title title-md">Список всех пользователей</h2>

      <ThePanelAdminUsersTable />
    </div>
  </section>
</template>

<script setup>
useSeo({ title: "Пользователи" });
</script>

<style lang="scss" scoped>
.users {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }
}
</style>
