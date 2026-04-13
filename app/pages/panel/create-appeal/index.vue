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

  <UiModal
    :is-open="isAiProcessingOpen"
    title="AI анализирует обращение"
    max-width="720px"
    @close="closeAiProcessing"
  >
    <ModalsAiProcessing
      :attempts="0"
      title="AI анализирует фото и описание"
      :messages="aiMessages"
    />
  </UiModal>
</template>

<script setup>
const router = useRouter();
const api = useApi();
useSeo({ title: "Создать обращение" });

const files = ref([]);
const comment = ref("");
const map = ref(null);
const isSubmitting = ref(false);
const appealId = ref("");
const isAiProcessingOpen = ref(false);

const aiMessages = [
  "ИИ изучает фотографии обращения...",
  "Сопоставляем описание с тем, что видно на фото...",
  "Подбираем категорию, приоритет и дедлайн...",
  "Определяем сотрудника с наименьшей нагрузкой...",
  "Готовим обращение к модерации...",
];

const error = ref({
  stepOne: false,
  stepTwo: false,
  stepThree: false,
});

const ensureAppealId = async () => {
  if (appealId.value) return appealId.value;

  const response = await api.client({
    url: "/appeals/reserve",
    method: "post",
  });

  const data = response?.data || response;
  appealId.value = String(data?.appealId || "").trim();

  if (!appealId.value) {
    throw new Error("Не удалось подготовить обращение");
  }

  return appealId.value;
};

const uploadImage = async () => {
  const draftId = await ensureAppealId();

  return await Promise.all(
    files.value.map(async (item) => {
      const formData = new FormData();
      formData.append("file", item.file);
      formData.append("folder", `cityhelp/appeals/${draftId}/photos`);

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

const deleteUploadedFiles = async (items = []) => {
  await Promise.allSettled(
    (Array.isArray(items) ? items : [])
      .filter((item) => item?.url)
      .map((item) =>
        api.client({
          url: "/blob/delete",
          method: "delete",
          params: { url: item.url },
        }),
      ),
  );
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
  isAiProcessingOpen.value = true;
  let uploaded = [];

  try {
    uploaded = await uploadImage();

    await api.client({
      url: "/appeals",
      method: "post",
      body: {
        appealId: appealId.value,
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
    appealId.value = "";
    router.push("/panel/user/my-appeals");
  } catch (error) {
    if (uploaded.length) {
      await deleteUploadedFiles(uploaded);
    }

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
    isAiProcessingOpen.value = false;
  }
};

const closeAiProcessing = () => {
  if (isSubmitting.value) return;
  isAiProcessingOpen.value = false;
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
