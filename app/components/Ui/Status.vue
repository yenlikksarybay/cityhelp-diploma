<template>
  <div class="status">
    <div
      class="status__wrapper"
      :class="{
        'status__wrapper--success': status === 'solved',
        'status__wrapper--pending': status === 'pending',
        'status__wrapper--rejected': status === 'rejected',
      }"
    >
      <UiIcon :icon="defineIcon" color="white" size="size-24" />
      <p class="status__text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  status: {
    type: String,
    default: "pending",
  },
});

const text = computed(() => {
  switch (props.status) {
    case "pending":
      return "В процессе";
    case "solved":
      return "Одобрено";
    case "rejected":
      return "Отклонено";
  }
});

const defineIcon = computed(() => {
  switch (props.status) {
    case "pending":
      return "time-i";
    case "solved":
      return "checkmark-i";
    case "rejected":
      return "close";
  }
});
</script>

<style lang="scss" scoped>
.status {
  &__wrapper {
    display: flex;
    align-items: center;
    gap: $gap-xs;
    padding: $padding-xs;
    justify-content: center;
    border-radius: $border-r-md;
    &--success {
      background-color: $green-500;
      color: $white;
    }
    &--pending {
      background-color: $green-500;
      color: $white;
    }
    &--rejected {
      background-color: $red-300;
      color: $white;
    }
  }
  &__text {
    white-space: nowrap;
  }
}
</style>
