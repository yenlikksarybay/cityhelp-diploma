<template>
  <div class="select" ref="selectRef">
    <p class="select__label">{{ label }}</p>
    <div class="select__wrapper">
      <div
        class="select__control"
        @click="toggle"
        :class="{ 'select__control--error': isError }"
      >
        <span
          v-if="selectedOption"
          class="select__value"
          v-html="selectedOption[labelKey]"
        >
        </span>
        <span v-else class="select__placeholder">
          {{ placeholder }}
        </span>

        <div class="select__icons">
          <UiIcon
            v-if="isClear && selectedOption && !disabled"
            @click="select(null)"
            icon="close"
            deg="left"
          />
          <UiIcon icon="chevron" size="size-20" deg="down" />
        </div>
      </div>

      <div v-show="isOpen && !disabled" class="select__dropdown">
        <input
          type="text"
          v-model="search"
          class="select__search"
          :placeholder="searchPlaceholder"
          v-if="isSearch"
        />
        <ul class="select__list">
          <li
            v-for="option in filteredOptions"
            :key="option.id"
            class="select__option"
            :class="{
              'select__option--selected': option.id === modelValue?.id,
            }"
            @click="select(option)"
            v-html="option[labelKey]"
          ></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  modelValue: [String, Number, Object],
  options: { type: Array, default: [] },
  labelKey: { type: String, default: "name" },
  placeholder: { type: String, default: "" },
  searchPlaceholder: {
    type: String,
    default: "...",
  },
  isSearch: { type: Boolean, default: true },
  isClear: { type: Boolean, default: true },
  disabled: Boolean,
  isError: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const search = ref("");
const selectRef = ref(null);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const close = () => {
  isOpen.value = false;
};

const select = (option) => {
  emit("update:modelValue", option);
  close();
};

const selectedOption = computed(
  () => props.options?.find((o) => o.id === props.modelValue?.id) || null,
);

const filteredOptions = computed(() => {
  if (!search.value) {
    return props.options;
  }
  return props.options.filter((o) =>
    o[props.labelKey].toLowerCase().includes(search.value.toLowerCase()),
  );
});

const handleClickOutside = (event) => {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    close();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style lang="scss" scoped>
.select {
  width: 100%;
  &__wrapper {
    position: relative;
  }

  &__control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid $surface-300;
    border-radius: $border-r-md;
    padding: $padding-sm;
    cursor: pointer;
    background: $white;
    transition: border-color 0.2s;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0ch;
      height: 0px;
    }
    &--error {
      border: 1px solid $red-300;
    }
  }

  &__value {
    color: $black;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__label {
    font-size: 14px;
    color: $surface-600;
    font-weight: 500;
  }

  &__placeholder {
    color: $surface-400;
  }

  &__arrow {
    margin-left: 8px;
    transition: transform 0.2s;
  }

  &__icons {
    display: flex;
    align-items: center;
    gap: $gap-md;
  }

  &__dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    background: $white;
    border: 1px solid $surface-200;
    border-radius: 6px;
    box-shadow: $box-shadow;
    z-index: 10;
    padding: 6px 0;
  }

  &__search {
    width: 100%;
    padding: 6px 10px;
    border: none;
    border-bottom: 1px solid $surface-150;
    outline: none;
    font-size: 14px;
  }

  &__list {
    max-height: 200px;
    overflow-y: auto;
  }

  &__option {
    padding: $padding-sm;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: $surface-100;
    }

    &--selected {
      background: $surface-150;
      font-weight: 500;
    }
  }
}
</style>
