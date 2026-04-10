<template>
  <section v-if="show" class="work-form">
    <div class="work-form__wrapper">
      <h4 class="work-form__title title-md title-point">Сдать работу</h4>

      <ThePanelAppealWorkImages v-model="files" />

      <div class="work-form__field">
        <p class="work-form__label">Комментарий сотрудника</p>
        <UiTextarea v-model="comment" placeholder="Опишите, что было сделано" />
      </div>

      <div class="work-form__actions">
        <UiButton
          class="work-form__btn primary-btn"
          :label="isSubmitting ? 'Отправка...' : 'Отправить на проверку'"
          :disabled="isSubmitting || !comment.trim() || !files.length"
          @action="submit"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["submit"]);

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
});

const comment = ref("");
const files = ref([]);

const submit = () => {
  if (!comment.value.trim() || !files.value.length) return;
  emit("submit", {
    employeeNote: comment.value.trim(),
    files: files.value,
  });
};
</script>

<style lang="scss" scoped>
.work-form {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
    padding: $padding-md;
    border-radius: $border-r-md;
    // background: $surface-100;
    box-shadow: $box-shadow;
  }
  &__field {
    display: flex;
    flex-direction: column;
    gap: $gap-sm;
  }
  &__label {
    font-weight: 700;
  }
  &__actions {
    display: flex;
    justify-content: flex-end;
  }
  &__btn {
    min-width: 240px;
  }
}
</style>
