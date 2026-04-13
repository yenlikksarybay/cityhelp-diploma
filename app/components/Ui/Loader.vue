<template>
  <client-only>
    <div class="loader" :class="{ show: loaderStore.isLoader }">
      <div class="loader__spinner" aria-label="Загрузка"></div>
    </div>
  </client-only>
</template>

<script setup>
const loaderStore = useLoaderStore();
</script>

<style scoped lang="scss">
.loader {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  display: none;
  align-items: center;
  justify-content: center;
  background: rgba(10, 12, 16, 0.12);
  backdrop-filter: blur(2px);

  &.show {
    display: flex;
  }

  &__spinner {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 4px solid rgba($secondary-accent, 0.16);
    border-top-color: $secondary-accent;
    border-right-color: rgba($secondary-accent, 0.42);
    animation: spin 0.8s linear infinite;
    box-shadow: 0 0 0 6px rgba($secondary-accent, 0.04), 0 0 22px rgba($secondary-accent, 0.14);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
