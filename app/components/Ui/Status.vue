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
      }"
    >
      <UiIcon :icon="defineIcon" color="white" size="size-24" />
      <p class="status__text">{{ resolvedText }}</p>
    </div>
  </div>
</template>

<script setup>
import {
  getAppealIcon,
  getAppealLabel,
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
const resolvedText = computed(() => {
  return props.text || getAppealLabel(props.status) || "—";
});

const defineIcon = computed(() => {
  return getAppealIcon(props.status);
});
</script>

<style lang="scss" scoped>
$status-new-bg: #dbeafe;
$status-new-color: #1d4ed8;
$status-moderation-bg: #ede9fe;
$status-moderation-color: #6d28d9;
$status-processing-bg: #fef3c7;
$status-processing-color: #b45309;
$status-needs-revision-bg: #fde68a;
$status-needs-revision-color: #92400e;
$status-completed-bg: #dcfce7;
$status-completed-color: #15803d;
$status-rated-bg: #ecfccb;
$status-rated-color: #4d7c0f;
$status-rejected-bg: #fee2e2;
$status-rejected-color: #b91c1c;

.status {
  &__wrapper {
    display: flex;
    align-items: center;
    gap: $gap-xs;
    padding: $padding-xs;
    justify-content: center;
    border-radius: $border-r-md;
    &--new {
      background-color: $status-new-bg;
      color: $status-new-color;
    }
    &--moderation {
      background-color: $status-moderation-bg;
      color: $status-moderation-color;
    }
    &--processing {
      background-color: $status-processing-bg;
      color: $status-processing-color;
    }
    &--needs-revision {
      background-color: $status-needs-revision-bg;
      color: $status-needs-revision-color;
    }
    &--completed {
      background-color: $status-completed-bg;
      color: $status-completed-color;
    }
    &--rated {
      background-color: $status-rated-bg;
      color: $status-rated-color;
    }
    &--rejected {
      background-color: $status-rejected-bg;
      color: $status-rejected-color;
    }
  }
  &__text {
    white-space: nowrap;
  }
}
</style>
