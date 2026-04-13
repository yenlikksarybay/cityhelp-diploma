<template>
  <section class="edit">
    <div class="edit__wrapper">
      <div class="edit__head">
        <h2 class="edit__title title-md">Редактирование обращения</h2>
        <p class="edit__subtitle">
          Изменения доступны только пока обращение находится на модерации.
        </p>
      </div>

      <div v-if="appeal" class="edit__status">
        <UiStatus :status="appeal.status" :text="statusText(appeal.status)" />
      </div>

      <ThePanelCreateAppealUploadImage
        v-model="files"
        :is-error="error.stepOne"
      />

      <UiIcon
        class="edit__arrow"
        icon="arrow-i"
        color="black"
        size="size-52"
        deg="down"
      />

      <ThePanelCreateAppealForm v-model="comment" :is-error="error.stepTwo" />

      <UiIcon
        class="edit__arrow"
        icon="arrow-i"
        color="black"
        size="size-52"
        deg="down"
      />

      <ThePanelCreateAppealMap v-model="map" :is-error="error.stepThree" />

      <UiButton
        class="edit__btn primary-btn"
        :label="isSubmitting ? 'Сохранение...' : 'Сохранить изменения'"
        :disabled="isSubmitting || !canSubmit"
        @action="saveAppeal"
      />
    </div>
  </section>
</template>

<script setup>
const api = useApi();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const roleStore = useRoleStore();

useSeo({ title: "Редактирование обращения" });

const appeal = ref(null);
const files = ref([]);
const comment = ref("");
const map = ref(null);
const isSubmitting = ref(false);

const error = ref({
  stepOne: false,
  stepTwo: false,
  stepThree: false,
});

const currentUserId = computed(() =>
  String(authStore.getUser?.id || authStore.getUser?._id || ""),
);

const currentAppealOwnerId = computed(() =>
  String(
    appeal.value?.user?.id ||
      appeal.value?.user?._id ||
      appeal.value?.user ||
      "",
  ),
);

const isOwner = computed(
  () =>
    roleStore.isUser &&
    currentUserId.value &&
    currentAppealOwnerId.value === currentUserId.value,
);

const canEdit = computed(
  () =>
    appeal.value?.status === "moderation" &&
    (isOwner.value || roleStore.isAdmin || roleStore.isSuperAdmin),
);

const canSubmit = computed(() => {
  return (
    files.value.length > 0 &&
    comment.value.trim().length >= 20 &&
    Boolean(map.value)
  );
});

const normalizeAppeal = (item) => ({
  id: item.id,
  description: item.description || "",
  photos: item.photos || [],
  location: item.location || null,
  status: item.status || "new",
  user: item.user || null,
});

const statusText = (status) => {
  switch (status) {
    case "moderation":
      return "На модерации";
    case "processing":
      return "В работе";
    case "needs_revision":
      return "Нужна доработка";
    case "completed":
      return "Завершено";
    case "rated":
      return "Оценено";
    case "rejected":
      return "Отклонено";
    default:
      return "Новое";
  }
};

const loadAppeal = async () => {
  const response = await api.client({
    url: `/appeals/${route.params.id}`,
    method: "get",
  });

  appeal.value = normalizeAppeal(response?.data || response || {});

  if (!canEdit.value) {
    useNotify({
      title: "Доступ запрещён",
      text: "Редактирование доступно только на модерации",
      status: "error",
    });
    router.push(`/panel/appeal/${route.params.id}`);
    return;
  }

  comment.value = appeal.value.description;
  map.value = appeal.value.location;
  files.value = (appeal.value.photos || []).map((item) => ({
    ...item,
    preview: item.url,
    isExisting: true,
  }));
};

const initialAppeal = await useFetchSsr({
  url: `/appeals/${route.params.id}`,
  method: "get",
});

appeal.value = normalizeAppeal(initialAppeal?.data || initialAppeal || {});

onMounted(async () => {
  await loadAppeal();
});

const uploadImage = async (items = []) => {
  const draftId = String(route.params.id);

  return await Promise.all(
    (Array.isArray(items) ? items : []).map(async (item) => {
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

const saveAppeal = async () => {
  if (isSubmitting.value || !canEdit.value) return;

  if (!files.value.length) {
    error.value.stepOne = true;
    useNotify({
      title: "Шаг 1",
      text: "Загрузите хотя бы одну фотографию",
      status: "error",
    });
    return;
  }

  if (comment.value?.trim().length < 20) {
    error.value.stepTwo = true;
    useNotify({
      title: "Шаг 2",
      text: "Минимум 20 символов",
      status: "error",
    });
    return;
  }

  if (!map.value) {
    error.value.stepThree = true;
    useNotify({
      title: "Шаг 3",
      text: "Выберите место на карте",
      status: "error",
    });
    return;
  }

  isSubmitting.value = true;

  const newFiles = files.value.filter((item) => item.file);
  const removedUrls = (appeal.value?.photos || [])
    .map((item) => item.url)
    .filter(Boolean)
    .filter((url) => !files.value.some((item) => item.url === url));

  let uploaded = [];

  try {
    uploaded = await uploadImage(newFiles);

    const uploadedQueue = [...uploaded];
    const finalPhotos = files.value.map((item) => {
      if (item.file) {
        return uploadedQueue.shift();
      }

      return {
        url: item.url,
        pathname: item.pathname || "",
        name: item.name || "",
        type: item.type || "",
        size: item.size || 0,
      };
    });

    await api.client({
      url: `/appeals/${route.params.id}`,
      method: "patch",
      body: {
        description: comment.value.trim(),
        location: map.value,
        photos: finalPhotos,
      },
    });

    if (removedUrls.length) {
      await deleteUploadedFiles(removedUrls.map((url) => ({ url })));
    }

    useNotify({
      title: "Сохранено",
      text: "Обращение обновлено",
      status: "success",
    });

    router.push(`/panel/appeal/${route.params.id}`);
  } catch (error) {
    if (uploaded.length) {
      await deleteUploadedFiles(uploaded);
    }

    useNotify({
      title: "Ошибка",
      text:
        error?.statusMessage ||
        error?.data?.statusMessage ||
        "Не удалось сохранить обращение",
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
.edit {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }
  &__head {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  &__subtitle {
    color: $surface-500;
    font-size: 14px;
  }
  &__status {
    display: flex;
    justify-content: flex-start;
  }
  &__arrow {
    margin: 0 auto;
  }
  &__btn {
    margin-left: auto;
  }
}

@media (max-width: 768px) {
  .edit {
    &__btn {
      width: 100%;
    }
  }
}
</style>
