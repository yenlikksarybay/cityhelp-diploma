<template>
  <div class="status">
    <div
      class="status__wrapper"
      :class="{
        'status__wrapper--new': resolvedStatus === 'new',
        'status__wrapper--moderation': resolvedStatus === 'moderation',
        'status__wrapper--processing': resolvedStatus === 'processing',
        'status__wrapper--needs-revision': resolvedStatus === 'needs_revision',
        'status__wrapper--completed': resolvedStatus === 'completed',
        'status__wrapper--rated': resolvedStatus === 'rated',
        'status__wrapper--rejected': resolvedStatus === 'rejected',
        'status__wrapper--info': resolvedVariant === 'info',
        'status__wrapper--warning': resolvedVariant === 'warning',
        'status__wrapper--success': resolvedVariant === 'success',
        'status__wrapper--danger': resolvedVariant === 'danger',
      }"
    >
      <UiIcon :icon="defineIcon" :color="iconColorClass" size="size-24" />
      <p class="status__text">{{ resolvedText }}</p>
    </div>
  </div>
</template>

<script setup>
import {
  getAppealIcon,
  getAppealLabel,
  getAppealVariant,
} from "../../../server/constants/appeal.js";

const props = defineProps({
  status: {
    type: String,
    default: "new",
  },
  text: {
    type: String,
    default: "",
  },
});

const resolvedStatus = computed(() => String(props.status || "").toLowerCase());
const resolvedVariant = computed(() => getAppealVariant(props.status));
const resolvedText = computed(() => {
  return props.text || getAppealLabel(props.status) || "—";
});

const defineIcon = computed(() => {
  return getAppealIcon(props.status);
});

const iconColorClass = computed(() => {
  switch (resolvedStatus.value) {
    case "new":
      return "status-new-color";
    case "moderation":
      return "status-moderation-color";
    case "processing":
      return "status-processing-color";
    case "needs_revision":
      return "status-needs-revision-color";
    case "completed":
      return "status-completed-color";
    case "rated":
      return "status-rated-color";
    case "rejected":
      return "status-rejected-color";
    default:
      return "status-new-color";
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
    &--new {
      background-color: $blue-100;
      color: $blue-700;
    }
    &--moderation {
      background-color: $violet-100;
      color: $violet-700;
    }
    &--processing {
      background-color: $amber-100;
      color: $amber-700;
    }
    &--needs-revision {
      background-color: $yellow-100;
      color: $yellow-700;
    }
    &--completed {
      background-color: $green-100;
      color: $green-700;
    }
    &--rated {
      background-color: $lime-100;
      color: $lime-700;
    }
    &--rejected {
      background-color: $red-100;
      color: $red-700;
    }
    &--info {
      background-color: $blue-100;
      color: $blue-700;
    }
    &--warning {
      background-color: $amber-100;
      color: $amber-700;
    }
    &--success {
      background-color: $green-100;
      color: $green-700;
    }
    &--danger {
      background-color: $red-100;
      color: $red-700;
    }
  }
  &__text {
    white-space: nowrap;
  }
}
</style>
