<template>
  <div class="pagination">
    <div
      class="pagination__wrapper"
      :class="{ 'pagination__wrapper--center': position === 'center' }"
    >
      <UiIcon
        v-if="modelValue > 1"
        icon="chevron"
        class="pagination__icon"
        :hover="true"
        @click="setPagination(modelValue - 1)"
      />

      <div class="pagination__numbers">
        <p
          v-for="(num, idx) in visiblePages"
          :key="idx"
          class="pagination__number"
          :class="{ 'pagination__number--active': num === modelValue }"
          @click="typeof num === 'number' && setPagination(num)"
        >
          {{ num }}
        </p>
      </div>

      <UiIcon
        v-if="modelValue < total"
        icon="chevron"
        class="pagination__icon"
        deg="down"
        :hover="true"
        @click="setPagination(modelValue + 1)"
      />
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const route = useRoute();
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  total: Number,
  modelValue: Number,
  position: {
    type: String,
    default: "center",
  },
});

const setPagination = (num) => {
  emit("update:modelValue", num);
  router.push({ path: route.path, query: { ...route.query, page: num } });
  if (process.client) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};

const visiblePages = computed(() => {
  const total = props.total;
  const current = props.modelValue;
  const maxVisible = 7;

  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, "...", total - 2, total - 1, total];
  }

  if (current >= total - 3) {
    return [1, 2, 3, "...", total - 3, total - 2, total - 1, total];
  }

  return [
    current - 2,
    current - 1,
    current,
    "...",
    total - 2,
    total - 1,
    total,
  ];
});

setPagination(props.modelValue);
</script>

<style lang="scss" scoped>
.pagination {
  width: 100%;
  &__wrapper {
    display: flex;
    align-items: center;
    gap: $gap-md;
    &--center {
      justify-content: center;
    }
  }
  &__numbers {
    display: flex;
    align-items: center;
  }
  &__icon {
    cursor: pointer;
  }
  &__number {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $surface-300;
    cursor: pointer;
    user-select: none;
    &--active {
      background-color: rgba($blue-500, 0.12);
      border-radius: $border-r-md;
      color: $surface-600;
    }
  }
}
</style>
