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
          'status__text--info': resolvedVariant === 'info',
          'status__text--warning': resolvedVariant === 'warning',
          'status__text--success': resolvedVariant === 'success',
          'status__text--danger': resolvedVariant === 'danger',
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
  getAppealVariant,
} from "../../../server/constants/appeal.js";

const props = defineProps({
  text: String,
  status: String,
});

const resolvedStatus = computed(() => String(props.status || "").toLowerCase());
const resolvedVariant = computed(() => getAppealVariant(props.status));
const resolvedText = computed(() => {
  return props.text || getAppealLabel(props.status) || props.status || "—";
});
</script>

<style lang="scss" scoped>
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
    &--info {
      color: $status-new-color;
    }
    &--warning {
      color: $status-processing-color;
    }
    &--success {
      color: $status-completed-color;
    }
    &--danger {
      color: $status-rejected-color;
    }
  }
}
</style>
