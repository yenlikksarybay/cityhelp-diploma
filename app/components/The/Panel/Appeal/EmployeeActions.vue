<template>
  <section v-if="show" class="actions">
    <div class="actions__wrapper">
      <h4 class="actions__title title-md title-point">Действия сотрудника</h4>
      <p class="actions__text">
        Если обращение закреплено за вами, можно принять его в работу.
      </p>

      <div class="actions__row">
        <UiStatusText :status="statusType" :text="statusText" />
        <UiButton
          class="actions__btn primary-btn"
          :label="isSubmitting ? 'Принятие...' : 'Принять обращение'"
          :disabled="isSubmitting"
          @action="emit('accept')"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["accept"]);

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  statusText: {
    type: String,
    default: "Новое",
  },
  statusType: {
    type: String,
    default: "new",
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.actions {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
    padding: $padding-md;
    border-radius: $border-r-md;
    background: $surface-100;
  }
  &__text {
    color: $surface-500;
    font-size: 14px;
  }
  &__row {
    display: flex;
    justify-content: space-between;
    gap: $gap-md;
    align-items: center;
    flex-wrap: wrap;
  }
  &__btn {
    min-width: 220px;
  }
}
</style>
