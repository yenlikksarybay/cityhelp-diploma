<template>
  <div class="app">
    <div class="app__wrapper">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>

      <UiNotify />
      <UiLoader />
    </div>
  </div>

  <UiModal
    :is-open="authStore.isAuthModal"
    max-width="480px"
    @close="closeModal"
  >
    <ModalsAuth />
  </UiModal>
</template>

<script setup>
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const closeModal = () => {
  router.push({ path: route.path, query: {} });
  authStore.setAuthModal(false);
};
</script>

<style lang="scss" scoped>
.app {
  &__wrapper {
  }
}
</style>
