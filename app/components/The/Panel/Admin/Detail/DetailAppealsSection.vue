<template>
  <div class="detail-appeals">
    <div class="detail-appeals__head">
      <h3 class="title-sm">
        {{ title }}
      </h3>
      <UiTabs
        v-if="tabs?.length"
        :tabs="tabs"
        v-model="selectedTab"
        :is-scroll="true"
      />
    </div>

    <ThePanelAdminAppealsTable :rows="rows" />

    <UiPagination
      v-if="totalPages > 1"
      v-model="pageProxy"
      :total="totalPages"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "Обращения",
  },
  rows: {
    type: Array,
    default: () => [],
  },
  tabs: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: Object,
    default: null,
  },
  page: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["update:modelValue", "update:page"]);

const selectedTab = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const pageProxy = computed({
  get: () => props.page,
  set: (value) => emit("update:page", value),
});
</script>

<style lang="scss" scoped>
.detail-appeals {
  display: flex;
  flex-direction: column;
  gap: $gap-md;

  &__head {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }
}
</style>
