<template>
  <section class="textarea">
    <div class="textarea__wrapper">
      <h5 class="textarea__title title-md title-point">Комментировать</h5>
      <UiTextarea v-model="comment" :placeholder="placeholder" />
      <div class="textarea__actions">
        <UiButton
          class="textarea__btn primary-btn"
          :label="isSubmitting ? 'Отправка...' : 'Отправить'"
          :disabled="isSubmitting || !comment.trim()"
          @action="submit"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
const api = useApi();
const authStore = useAuthStore();
const roleStore = useRoleStore();
const route = useRoute();

const props = defineProps({
  appeal: {
    type: Object,
    default: null,
  },
});

const comment = ref("");
const isSubmitting = ref(false);

const placeholder = computed(() => {
  if (roleStore.isEmployee) return "Напишите заметку сотрудника...";
  if (roleStore.isAdmin || roleStore.isSuperAdmin) return "Напишите заметку модератора...";
  return "Комментарий";
});

const submit = async () => {
  if (!comment.value.trim() || isSubmitting.value) return;

  isSubmitting.value = true;
  try {
    const payload = roleStore.isEmployee
      ? { employeeNote: comment.value.trim(), status: "processing" }
      : { moderationNote: comment.value.trim(), status: "moderation" };

    await api.client({
      url: `/appeals/${route.params.id}`,
      method: "patch",
      body: payload,
    });

    useNotify({
      title: "Сохранено",
      text: "Комментарий добавлен",
      status: "success",
    });
    comment.value = "";
  } catch (error) {
    useNotify({
      title: "Ошибка",
      text: error?.statusMessage || error?.data?.statusMessage || "Не удалось сохранить комментарий",
      status: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style lang="scss" scoped>
.textarea {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }
  &__actions {
    display: flex;
    justify-content: flex-end;
  }
  &__btn {
    margin-left: auto;
  }
}
</style>
