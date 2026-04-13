<template>
  <div class="menu">
    <p class="menu__text">Выберите нужное действие</p>

    <div class="menu__list">
      <UiButton
        v-if="showEdit"
        tag="a"
        :href="`/panel/edit-appeal/${appealId}`"
        before-icon="pen-i"
        icon-size="size-24"
        class="menu__btn secondary-btn"
        label="Редактировать"
        icon-color="secondary-accent"
      />
      <UiButton
        v-if="showRecheck"
        before-icon="ai-i"
        icon-color="secondary-accent"
        icon-size="size-24"
        class="menu__btn secondary-btn"
        label="Перепроверить AI"
        @action="emit('recheck')"
      />
      <UiButton
        v-if="showAssign"
        class="menu__btn secondary-btn"
        label="Назначить сотрудника"
        @action="emit('assign')"
        before-icon="user-i"
        icon-color="secondary-accent"
      />
      <UiButton
        v-if="showDelete"
        before-icon="trash-i"
        icon-size="size-24"
        icon-color="red-300"
        class="menu__btn menu__btn--delete secondary-btn"
        label="Удалить обращение"
        @action="emit('delete')"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  appealId: {
    type: [String, Number],
    required: true,
  },
  showEdit: {
    type: Boolean,
    default: false,
  },
  showRecheck: {
    type: Boolean,
    default: false,
  },
  showAssign: {
    type: Boolean,
    default: false,
  },
  showDelete: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["recheck", "assign", "delete"]);
</script>

<style lang="scss" scoped>
.menu {
  display: flex;
  flex-direction: column;
  gap: $gap-md;

  &__text {
    color: $surface-500;
    line-height: 1.5;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: $gap-sm;
  }

  &__btn {
    width: 100%;

    &--delete {
      border: 1px solid $red-300;
      color: $red-300;

      &:hover {
        background: rgba($red-300, 0.06);
      }
    }
  }
}
</style>
