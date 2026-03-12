<template>
  <transition name="up-fade">
    <div v-if="isVisible" class="up" @click="scrollToTop">
      <div class="up__wrapper">
        <UiIcon class="up__icon" icon="chevron" color="white" size="size-24" />
      </div>
    </div>
  </transition>
</template>

<script setup>
const isVisible = ref(false);

const updateVisibility = () => {
  isVisible.value = window.scrollY > 200;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  updateVisibility();
  window.addEventListener("scroll", updateVisibility, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateVisibility);
});
</script>

<style lang="scss" scoped>
.up {
  &__wrapper {
    width: 40px;
    height: 40px;
    background-color: $secondary-accent;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: $box-shadow;
  }
  &__icon {
    transform: translateY(-1px);
  }
}
</style>
