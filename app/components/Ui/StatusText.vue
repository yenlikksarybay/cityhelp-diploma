<template>
  <div class="status">
    <div class="status__wrapper">
      <p
        class="status__text"
        :class="{
          'status__text--new': resolvedStatus === 'new',
          'status__text--moderation': resolvedStatus === 'moderation',
          'status__text--processing': resolvedStatus === 'processing',
          'status__text--needs-revision': resolvedStatus === 'needs_revision',
          'status__text--completed': resolvedStatus === 'completed',
          'status__text--rated': resolvedStatus === 'rated',
          'status__text--rejected': resolvedStatus === 'rejected',
        }"
      >
        {{ resolvedText }}
      </p>
    </div>
  </div>
</template>

<script setup>
import {
  getAppealLabel,
} from "../../../server/constants/appeal.js";

const props = defineProps({
  text: String,
  status: String,
});

const resolvedStatus = computed(() => String(props.status || "").toLowerCase());
const resolvedText = computed(() => {
  return props.text || getAppealLabel(props.status) || props.status || "—";
});
</script>

<style lang="scss" scoped>
$status-new-color: #1d4ed8;
$status-moderation-color: #6d28d9;
$status-processing-color: #b45309;
$status-needs-revision-color: #92400e;
$status-completed-color: #15803d;
$status-rated-color: #4d7c0f;
$status-rejected-color: #b91c1c;

.status {
  &__wrapper {
  }
  &__text {
    &--new {
      color: $status-new-color;
    }
    &--moderation {
      color: $status-moderation-color;
    }
    &--processing {
      color: $status-processing-color;
    }
    &--needs-revision {
      color: $status-needs-revision-color;
    }
    &--completed {
      color: $status-completed-color;
    }
    &--rated {
      color: $status-rated-color;
    }
    &--rejected {
      color: $status-rejected-color;
    }
  }
}
</style>
