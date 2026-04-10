<template>
  <section class="form">
    <div class="form__wrapper" :class="{ 'form__wrapper--error': isError }">
      <p class="form__number">Шаг 2</p>
      <h3 class="form__title title-sm">Ваш комментарий *</h3>
      <p class="form__text">(Минимум 20 символов)</p>
      <UiTextarea class="form__textarea" v-model="textarea" />
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  isError: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const textarea = computed({
  get: () => props.modelValue || "",
  set: (value) => emit("update:modelValue", value),
});
</script>

<style lang="scss" scoped>
.form {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
    position: relative;
    border-radius: $border-r-md;
    border: 2px solid $secondary-accent;
    padding: $padding-xxl $padding-md $padding-md $padding-md;
    box-shadow: $box-shadow;
    width: 100%;
    &--error {
      border: 2px solid $red-300;
    }
  }
  &__number {
    position: absolute;
    top: -20px;
    font-size: 20px;
    background-color: $secondary-accent;
    // width: 60px;
    // height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $white;
    border-radius: $border-r-md;
    padding: $padding-xs $padding-md;
  }
  &__text {
    font-size: 14px;
    color: $surface-400;
  }
}
</style>
