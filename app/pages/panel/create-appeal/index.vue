<template>
  <section class="create">
    <div class="create__wrapper">
      <h2 class="create__title title-md">Пройдите все шаги</h2>

      <ThePanelCreateAppealUploadImage
        v-model="files"
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
        :label="isSubmitting ? 'Создание...' : 'Создать обращение'"
        :disabled="isSubmitting"
        @action="postAppeal"
      />
    </div>
  </section>
</template>

<script setup>
const router = useRouter();
const api = useApi();
useSeo({ title: "Создать обращение" });

const files = ref([]);
const comment = ref("");
const map = ref(null);
const isSubmitting = ref(false);

const error = ref({
  stepOne: false,
  stepTwo: false,
  stepThree: false,
});

const uploadImage = async () => {
  return await Promise.all(
    files.value.map(async (item) => {
      const formData = new FormData();
      formData.append("file", item.file);

      const response = await api.client({
        url: "/blob/upload",
        method: "post",
        body: formData,
      });

      const data = response?.data || response;

      return {
        url: data?.url,
        pathname: data?.pathname || "",
        name: item.name || "",
        type: item.file?.type || "",
        size: item.file?.size || 0,
      };
    }),
  );
};

const revokePreviewUrls = () => {
  files.value.forEach((item) => {
    if (item?.preview) {
      URL.revokeObjectURL(item.preview);
    }
  });
};

const postAppeal = async () => {
  if (isSubmitting.value) return;

  if (!files.value.length) {
    setTimeout(() => {
      useNotify({
        title: "Шаг 1",
        text: "Загрузите фотографии обращения",
        status: "error",
      });
      error.value.stepOne = true;
    }, 0);
  }
  if (comment.value?.length < 20) {
    setTimeout(() => {
      useNotify({
        title: "Шаг 2",
        text: "Минимум 20 символов",
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

  isSubmitting.value = true;

  try {
    const uploaded = await uploadImage();

    await api.client({
      url: "/appeals",
      method: "post",
      body: {
        description: comment.value,
        location: map.value,
        photos: uploaded,
      },
    });

    useNotify({
      title: "Создание обращения",
      text: "Обращение создано",
      status: "success",
    });

    revokePreviewUrls();
    files.value = [];
    comment.value = "";
    map.value = null;
    router.push("/panel/user/my-appeals");
  } catch (error) {
    useNotify({
      title: "Ошибка",
      text:
        error?.statusMessage ||
        error?.data?.statusMessage ||
        "Не удалось создать обращение",
      status: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

watch(
  () => files.value,
  () => {
    error.value.stepOne = false;
  },
  { deep: true },
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
