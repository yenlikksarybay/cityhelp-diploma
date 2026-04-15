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
      color: $blue-700;
    }
    &--moderation {
      color: $violet-700;
    }
    &--processing {
      color: $amber-700;
    }
    &--needs-revision {
      color: $yellow-700;
    }
    &--completed {
      color: $green-700;
    }
    &--rated {
      color: $lime-700;
    }
    &--rejected {
      color: $red-700;
    }
    &--info {
      color: $blue-700;
    }
    &--warning {
      color: $amber-700;
    }
    &--success {
      color: $green-700;
    }
    &--danger {
      color: $red-700;
    }
  }
}
</style>
