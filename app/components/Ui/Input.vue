<template>
  <div class="input">
    <label :for="name" class="input__label" v-if="label">{{ label }}</label>
    <div
      class="input__wrapper"
      :class="(customClass, { 'input__field--error': isError })"
    >
      <UiIcon
        v-if="beforeIcon"
        :icon="beforeIcon"
        :color="iconColor"
        :size="iconSize"
      />
      <input
        class="input__field"
        :class="{
          'input__field--center': isCenter,
          'input__field--disabled': disabled,
        }"
        :type="typeInput"
        :name="name"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :disabled="disabled"
        :id="name"
        v-maska
        :data-maska="maska"
        :maxlength="maxLength"
      />
      <UiIcon
        v-if="afterIcon"
        :icon="afterIcon"
        :color="iconColor"
        :size="iconSize"
      />
      <UiIcon
        v-else-if="type === 'password'"
        :icon="typeInput === 'password' ? 'eye-i' : 'eye-open-i'"
        @click="changeType"
        :color="iconColor"
        :size="iconSize"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: "text",
  },
  modelValue: [String, Number],
  maska: {
    type: String,
    default: "",
  },
  label: String,
  placeholder: String,
  beforeIcon: String,
  afterIcon: String,
  iconSize: String,
  iconColor: String,
  customClass: String,
  isCenter: Boolean,
  isError: Boolean,
  name: String,
  disabled: Boolean,
  maxLength: {
    type: Number,
    default: 254,
  },
});

const typeInput = ref(props.type);

const changeType = () => {
  typeInput.value = typeInput.value === "password" ? "text" : "password";
};
</script>

<style lang="scss" scoped>
.input {
  width: 100%;
  text-align: left;

  &__wrapper {
    border-radius: $border-r-md;
    padding: $padding-sm;
    max-width: 100%;
    border: 1px solid $surface-300;
    display: flex;
    gap: $gap-xs;
    align-items: center;
    justify-content: space-between;
    background-color: $white;
    &::-webkit-scrollbar {
      width: 0ch;
      height: 0px;
    }
  }
  &__label {
    color: $surface-600;
    font-weight: 500;
    font-size: 14px;
  }
  &__field {
    width: 100%;
    font-size: 16px;
    &--center {
      text-align: center;
      font-size: 16px;
      font-weight: 400;
    }
    &--error {
      border: 1px solid $red-300;
    }
    &--disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    &[placeholder] {
    }
  }
}
</style>
