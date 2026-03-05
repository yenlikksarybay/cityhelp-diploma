<template>
  <section class="info">
    <div
      class="info__wrapper"
      :class="info.bgColor"
      :style="{ border: `2px solid ${info.borderColor}` }"
    >
      <UiIcon :icon="info.icon" size="size-42" :color="info.iconColor" />
      <h3 class="info__title title-sm" :style="{ color: info.textColor }">
        {{ info.name }}
      </h3>
      <p class="info__text" :style="{ color: info.textColor }">
        "{{ info.text }}"
      </p>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  info: Object,
});
</script>

<style lang="scss" scoped>
.info {
  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $gap-md;
    padding: $padding-xl;
    min-height: 200px;
    border-radius: $border-r-md;
    // background-color: $surface-200;
    border: 2px solid $surface-200;
    box-shadow: $box-shadow;
  }
  &__title {
    font-weight: 400;
    white-space: nowrap;
  }
  &__text {
    font-weight: 700;
  }
}
</style>
