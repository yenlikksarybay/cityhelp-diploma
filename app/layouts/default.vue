<template>
  <div class="layouts">
    <div class="layouts__wrapper">
      <BaseHeader />

      <h2 class="layouts__title">{{ titleStore.currentTitle }}</h2>
      <div class="layouts__content">
        <BaseAside
          class="layouts__aside"
          :class="{ 'layouts__aside--mobile': asideStore.isMobileOpen }"
        />
        <main class="layouts__main">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
const titleStore = useTitleStore();
const asideStore = useAsideStore();
const authStore = useAuthStore();

const route = useRoute();
const router = useRouter();

const isOpenPossibility = computed(
  () => route.query?.modal === "possibility" || false,
);

const closeModalPossibility = () => {
  const newQuery = { ...route.query };
  delete newQuery.modal;

  router.push({
    path: route.path,
    query: newQuery,
  });
};

watch(
  () => authStore?.isAuth,
  (newVal) => {
    !newVal ? router.push("/") : null;
  },
);
</script>

<style lang="scss" scoped>
.layouts {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xl;
    padding: $padding-wrapper;
  }
  &__content {
    display: flex;
    gap: $gap-xl;
  }
  &__title {
    display: none;
  }
  &__main {
    flex-grow: 1;
    background-color: $white;
    transition: 0.4s;
    width: 100%;
    padding: $padding-pages;
    border-radius: $border-r-md;
    box-shadow: $box-shadow;
    overflow: hidden;
  }
  &__aside {
    position: sticky;
    top: 10px;
    align-self: flex-start;
    z-index: 10;
  }
}

@media (max-width: 768px) {
  .layouts {
    &__wrapper {
      padding: $padding-wrapper-md;
    }
    &__title {
      display: block;
      font-weight: 600;
    }
    &__aside {
      &--mobile {
        position: fixed;
        top: 0px;
        right: 0;
      }
    }
    &__main {
      padding: $padding-pages-md;
    }
  }
}
</style>
