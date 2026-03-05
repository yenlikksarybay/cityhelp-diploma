<template>
  <section class="create">
    <div class="create__wrapper">
      <h2 class="create__title title-md">Пройдите все шаги</h2>

      <ThePanelCreateAppealUploadImage
        v-model="file"
        :is-error="error.stepOne"
      />

      <UiIcon
        class="create__arrow"
        icon="arrow-i"
        color="black"
        size="size-52"
        deg="down"
      />

      <ThePanelCreateAppealForm v-model="comment" :is-error="error.stepTwo" />

      <UiIcon
        class="create__arrow"
        icon="arrow-i"
        color="black"
        size="size-52"
        deg="down"
      />

      <ThePanelCreateAppealMap v-model="map" :is-error="error.stepThree" />

      <UiButton
        class="create__btn primary-btn"
        label="Создать обращение"
        @action="postAppeal"
      />
    </div>
  </section>
</template>

<script setup>
const router = useRouter();
useSeo({ title: "Создать обращение" });

const file = ref(null);
const comment = ref("");
const map = ref(null);

const error = ref({
  stepOne: false,
  stepTwo: false,
  stepThree: false,
});

const postAppeal = () => {
  if (file.value && comment.value > 50 && map.value) {
    useNotify({
      title: "Создание обращения",
      text: "Обращение создано",
      status: "success",
    });

    router.push("/panel/user/my-appeals");
  }

  if (!file.value) {
    setTimeout(() => {
      useNotify({
        title: "Шаг 1",
        text: "Загрузите фотографии обращения",
        status: "error",
      });
      error.value.stepOne = true;
    }, 0);
  }
  if (comment.value?.length < 50) {
    setTimeout(() => {
      useNotify({
        title: "Шаг 2",
        text: "Минимум 50 символов",
        status: "error",
      });
      error.value.stepTwo = true;
    }, 50);
  }
  if (!map.value) {
    setTimeout(() => {
      useNotify({
        title: "Шаг 3",
        text: "Выберите место на карте",
        status: "error",
      });
      error.value.stepThree = true;
    }, 100);
  }
};

watch(
  () => file.value,
  () => {
    error.value.stepOne = false;
  },
);

watch(
  () => comment.value,
  () => {
    error.value.stepTwo = false;
  },
);

watch(
  () => map.value,
  () => {
    error.value.stepThree = false;
  },
);
</script>

<style lang="scss" scoped>
.create {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }
  &__title {
    margin-bottom: 16px;
  }
  &__arrow {
    margin: 0 auto;
  }
  &__btn {
    margin-left: auto;
  }
}

@media (max-width: 768px) {
  .create {
    &__btn {
      width: 100%;
    }
  }
}
</style>
