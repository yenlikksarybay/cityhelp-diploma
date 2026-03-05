<template>
  <div class="textarea">
    <div class="textarea__wrapper">
      <textarea
        class="textarea__field"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :maxlength="maxLength"
      ></textarea>
      <p class="textarea__limit">{{ modelValue?.length }} / {{ maxLength }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  placeholder: { type: String, default: "..." },
  maxLength: { type: Number, default: 255 },
  modelValue: { type: String, default: "" },
});
</script>

<style lang="scss" scoped>
.textarea {
  &__wrapper {
    width: 100%;
    border: 1px solid $surface-200;
    padding: $padding-md;
    border-radius: $border-r-md;
    box-shadow: $box-shadow;
    position: relative;
  }
  &__field {
    width: 100%;
    height: max-content;
    border: none;
    outline: none;
    resize: none;
    font-family: inherit;
    min-height: 150px;
    font-size: 16px;
  }
  &__limit {
    position: absolute;
    bottom: 16px;
    font-size: 14px;
    right: 16px;
  }
}
</style>
