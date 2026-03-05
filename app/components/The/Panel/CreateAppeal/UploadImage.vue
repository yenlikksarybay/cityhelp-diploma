<template>
  <section class="upload">
    <div class="upload__wrapper" :class="{ 'upload__wrapper--error': isError }">
      <p class="upload__number">Шаг 1</p>
      <h3 class="upload__title title-sm">Загрузите фотографии обращения *</h3>
      <UiFileUpload v-model="file" />
    </div>
  </section>
</template>

<script setup>
const file = ref(null);

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: [Object, File],
  isError: Boolean,
});

watch(
  () => file.value,
  () => {
    emit("update:modelValue", file.value);
  },
);
</script>

<style lang="scss" scoped>
.upload {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
    position: relative;
    border-radius: $border-r-md;
    border: 2px solid $secondary-accent;
    padding: $padding-xxl $padding-md $padding-md $padding-md;
    box-shadow: $box-shadow;
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
}
</style>
