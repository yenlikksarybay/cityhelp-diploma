<template>
  <div class="accordion">
    <article
      v-for="item in normalizedItems"
      :key="item.id"
      class="accordion__item"
      :class="{ 'accordion__item--open': openId === item.id }"
    >
      <button class="accordion__head" type="button" @click="toggle(item.id)">
        <div class="accordion__head-box">
          <p class="accordion__title">
            {{ item.title }}
          </p>
          <p v-if="item.meta" class="accordion__meta">
            {{ item.meta }}
          </p>
        </div>
        <UiIcon
          icon="arrow-i"
          size="size-20"
          :deg="openId === item.id ? 'down' : 'right'"
          color="secondary-accent"
        />
      </button>

      <transition name="accordion-fade">
        <div v-if="openId === item.id" class="accordion__body">
          <p class="accordion__text">
            {{ item.content }}
          </p>
        </div>
      </transition>
    </article>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: [Array, Object],
    default: () => [],
  },
  modelValue: {
    type: [String, Number, null],
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const normalizeItem = (item, key) => ({
  id: item?.id ?? key,
  title: item?.title ?? item?.question ?? "",
  meta: item?.meta ?? item?.category ?? "",
  content: item?.content ?? item?.answer ?? "",
});

const normalizedItems = computed(() => {
  if (Array.isArray(props.items)) {
    return props.items.map((item, index) => normalizeItem(item, item?.id ?? index));
  }

  return Object.entries(props.items || {}).map(([key, item]) => normalizeItem(item, key));
});

const openId = ref(props.modelValue);

const toggle = (id) => {
  openId.value = openId.value === id ? null : id;
  emit("update:modelValue", openId.value);
};

watch(
  () => props.modelValue,
  (value) => {
    openId.value = value;
  },
);

watch(
  normalizedItems,
  (items) => {
    if (!openId.value && items.length) {
      openId.value = items[0].id;
      emit("update:modelValue", openId.value);
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.accordion {
  display: grid;
  gap: $gap-md;

  &__item {
    background-color: $white;
    border-radius: $border-r-md;
    box-shadow: $box-shadow;
    border: 1px solid transparent;
    overflow: hidden;

    &--open {
      border-color: rgba($secondary-accent, 0.18);
    }
  }

  &__head {
    width: 100%;
    padding: $padding-md;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $gap-md;
    text-align: left;
  }

  &__head-box {
    display: grid;
    gap: 4px;
  }

  &__title {
    font-weight: 700;
  }

  &__meta {
    color: $surface-400;
    font-size: 13px;
  }

  &__body {
    padding: 0 $padding-md $padding-md;
  }

  &__text {
    color: $surface-600;
    line-height: 160%;
  }
}

.accordion-fade-enter-active,
.accordion-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.accordion-fade-enter-from,
.accordion-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
