<template>
  <div class="tabs">
    <div
      class="tabs__wrapper"
      :class="{
        'tabs__wrapper--scroll': isScroll,
        'tabs__wrapper--line': type === 'line',
        'tabs__wrapper--line-border': type === 'line-border',
      }"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="tabs__btn"
        :class="{
          'tabs__btn--active': tab?.id === modelValue?.id,
          'tabs__btn--line': type === 'line',
          'tabs__btn--line-border': type === 'line-border',
        }"
        @click="emit('update:modelValue', tab)"
      >
        <UiIcon
          v-if="tab.icon"
          :icon="tab.icon"
          size="size-24"
          :color="tab?.id === modelValue?.id ? 'white' : ''"
        />
        <span class="tabs__label">
          {{ tab.name }}
        </span>
        <span
          v-if="tab.count !== undefined && tab.count !== null"
          class="tabs__count"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  tabs: Array,
  modelValue: Object,
  isScroll: Boolean,
  type: String,
});
</script>

<style lang="scss" scoped>
.tabs {
  &__wrapper {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: $gap-md;
    &--scroll {
      width: 100%;
      overflow-x: scroll;
    }
    &--line {
      justify-content: flex-start;
      border-bottom: 1.5px solid $surface-150;
      padding: $padding-md 0;
    }
    &--line-border {
      justify-content: flex-start;
      padding: $padding-md 0;
    }
  }
  &__btn {
    width: 100%;
    padding: $padding-md;
    border-radius: $border-r-md;
    background-color: $surface-200;
    color: $surface-300;
    font-weight: 500;
    transition: 0.4s background-color;
    white-space: nowrap;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $gap-md;

    & :deep(.tabs__label) {
      display: inline-flex;
      align-items: center;
    }

    & :deep(.tabs__count) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 28px;
      height: 24px;
      padding: 0 8px;
      border-radius: 999px;
      background: rgba($white, 0.18);
      color: $white;
      font-size: 12px;
      font-weight: 600;
      line-height: 1;
    }

    &--line {
      padding: $padding-md;
      width: fit-content;
    }
    &--line-border {
      padding: $padding-md;
      background-color: transparent;
      border: 1px solid $secondary-accent;
      color: $surface-600;
    }
    &--active {
      color: $white;
      background-color: $secondary-accent;

      & :deep(.tabs__count) {
        background: rgba($white, 0.22);
      }
    }
  }
}
</style>
