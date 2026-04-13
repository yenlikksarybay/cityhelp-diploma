<template>
  <div class="delete">
    <div class="delete__wrapper">
      <p class="delete__text">
        Если вы уверены, что хотите удалить обращение, нажмите кнопку
        <UiStatusText status="rejected" text="'Удалить'" />.
      </p>

      <div class="delete__btns">
        <UiButton
          class="delete__btn delete__btn--cancel secondary-btn"
          label="Отменить"
          @action="emit('cancel')"
        />
        <UiButton
          class="delete__btn delete__btn--delete secondary-btn"
          label="Удалить"
          @action="emit('delete')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["cancel", "delete"]);
</script>

<style lang="scss" scoped>
.delete {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }
  &__text {
    text-align: center;
    font-size: 14px;
    font-weight: 500;
  }
  &__btns {
    display: flex;
    justify-content: center;
    gap: $gap-md;
  }
  &__btn {
    &--cancel {
      border: none;
      color: $surface-400;
    }
    &--delete {
      border: 1px solid $red-300;
      color: $red-300;
    }
  }
}
</style>
