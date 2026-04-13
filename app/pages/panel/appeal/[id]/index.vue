<template>
  <section class="appeal">
    <div class="appeal__wrapper">
      <div class="appeal__top">
        <h2 class="appeal__title title-md">
          {{ `Обращение №${route.params.id}` }}
        </h2>
        <div class="appeal__top-inner">
          <UiButton
            class="appeal__btn secondary-btn"
            label="Действия"
            before-icon="more-vertical-i"
            icon-size="size-20"
            icon-color="secondary-accent"
            @action="openActionsModal"
          />
        </div>
      </div>

      <div class="appeal__box">
        <div
          class="appeal__content"
          :class="{ 'appeal__content--aside': !asideStore.isOpen }"
        >
          <ThePanelAppealContent :appeal="appeal" />
          <ThePanelAppealAdminAnswer :appeal="appeal" />

          <ThePanelAppealEmployeeActions
            :show="showEmployeeAccept"
            :status-text="employeeStatusText"
            :status-type="employeeStatusType"
            :is-submitting="isEmployeeSubmitting"
            @accept="acceptAppeal"
          />

          <ThePanelAppealEmployeeWorkForm
            :show="showEmployeeWorkForm"
            :is-submitting="isWorkSubmitting"
            @submit="submitWork"
          />

          <ThePanelAppealAdminReviewForm
            :show="showAdminReviewForm"
            :is-submitting="isReviewSubmitting"
            @review="submitReview"
          />

          <ThePanelAppealRatingForm
            :show="showRatingForm"
            :is-submitting="isRatingSubmitting"
            @submit="submitRating"
          />
        </div>

        <div
          class="appeal__aside"
          :class="{ 'appeal__aside--aside': !asideStore.isOpen }"
        >
          <div class="appeal__aside-inner">
            <ThePanelAppealAsideInfo :appeal="appeal" />
            <UiButton
              v-if="canAssignEmployee"
              class="appeal__aside-btn secondary-btn"
              label="Назначить сотрудника"
              @action="openAssignModal"
            />
            <ThePanelAppealRoadmap :roadmap="appeal?.roadmap || []" />
          </div>
        </div>
      </div>
    </div>

    <UiUpToTop class="appeal__up" />
  </section>

  <UiModal
    :is-open="isOpenDeleteModal"
    title="Ты точно уверены?"
    max-width="600px"
    @close="closeDeleteModal"
  >
    <ModalsDeleteAppeal @cancel="onCancel" @delete="onDelete" />
  </UiModal>

  <UiModal
    :is-open="isOpenAssignModal"
    title="Назначить сотрудника"
    max-width="600px"
    @close="closeAssignModal"
  >
    <ModalsAssignEmployee
      v-model="selectedEmployee"
      :employees="employeeOptions"
      :is-submitting="isAssignSubmitting"
      @close="closeAssignModal"
      @save="assignEmployee"
    />
  </UiModal>

  <UiModal
    :is-open="isOpenAiRecheckModal"
    title="Перепроверка AI"
    max-width="600px"
    @close="closeAiRecheckModal"
  >
    <ModalsAiProcessing
      :attempts="0"
      title="AI перепроверяет обращение"
      :messages="aiMessages"
    />
  </UiModal>

  <UiModal
    :is-open="isOpenActionsModal"
    title="Действия с обращением"
    max-width="520px"
    @close="closeActionsModal"
  >
    <ModalsAppealActionsMenu
      :appeal-id="route.params.id"
      :show-edit="canEditAppeal"
      :show-recheck="canRecheckAi"
      :show-assign="canAssignEmployee"
      :show-delete="canDelete"
      @recheck="openAiRecheckModal"
      @assign="openAssignModal"
      @delete="openDeleteModal"
    />
  </UiModal>
</template>

<script setup>
const api = useApi();
const asideStore = useAsideStore();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const roleStore = useRoleStore();

const appeal = ref(null);
const employeeOptions = ref([]);
const selectedEmployee = ref(null);

const isOpenDeleteModal = ref(false);
const isOpenAssignModal = ref(false);
const isOpenAiRecheckModal = ref(false);
const isOpenActionsModal = ref(false);
const isEmployeeSubmitting = ref(false);
const isAssignSubmitting = ref(false);
const isWorkSubmitting = ref(false);
const isReviewSubmitting = ref(false);
const isRatingSubmitting = ref(false);
const isAiRecheckSubmitting = ref(false);

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

const currentAssignedEmployeeId = computed(() =>
  String(
    appeal.value?.assignedEmployee?.id ||
      appeal.value?.assignedEmployee?._id ||
      appeal.value?.assignedEmployee ||
      "",
  ),
);

const isOwner = computed(
  () =>
    roleStore.isUser &&
    currentUserId.value &&
    currentAppealOwnerId.value === currentUserId.value,
);

const isAssignedEmployee = computed(
  () =>
    roleStore.isEmployee &&
    currentUserId.value &&
    currentAssignedEmployeeId.value === currentUserId.value,
);

const canDelete = computed(
  () =>
    roleStore.isAdmin ||
    roleStore.isSuperAdmin ||
    (isOwner.value && currentAppealOwnerId.value),
);

const canEditAppeal = computed(
  () =>
    appeal.value?.status === "moderation" &&
    (roleStore.isAdmin || roleStore.isSuperAdmin || isOwner.value),
);

const canAssignEmployee = computed(
  () => roleStore.isAdmin || roleStore.isSuperAdmin,
);

const canRecheckAi = computed(
  () =>
    (roleStore.isAdmin || roleStore.isSuperAdmin) &&
    appeal.value?.status === "moderation",
);

const employeeStatusText = computed(() => {
  switch (appeal.value?.status) {
    case "new":
      return "Новое обращение";
    case "needs_revision":
      return "Требуется повторная работа";
    default:
      return "Обращение закреплено";
  }
});

const employeeStatusType = computed(() => {
  switch (appeal.value?.status) {
    case "new":
      return "new";
    case "needs_revision":
      return "needs_revision";
    default:
      return "new";
  }
});

const showEmployeeAccept = computed(
  () => isAssignedEmployee.value && appeal.value?.status === "new",
);

const showEmployeeWorkForm = computed(
  () =>
    isAssignedEmployee.value &&
    ["processing", "needs_revision"].includes(appeal.value?.status),
);

const showAdminReviewForm = computed(
  () =>
    (roleStore.isAdmin || roleStore.isSuperAdmin) &&
    appeal.value?.status === "moderation",
);

const showRatingForm = computed(
  () =>
    isOwner.value &&
    (appeal.value?.status === "completed" ||
      appeal.value?.status === "rated") &&
    !appeal.value?.rating?.score,
);

const normalizeAppeal = (item) => ({
  id: item.id,
  description: item.description || "",
  photos: item.photos || [],
  location: item.location || {},
  category: item.category || "",
  priority: item.priority || "medium",
  status: item.status || "new",
  user: item.user || null,
  assignedEmployee: item.assignedEmployee || null,
  moderationNote: item.moderationNote || "",
  employeeNote: item.employeeNote || "",
  fixedLocation: item.fixedLocation || null,
  fixedImages: item.fixedImages || [],
  aiResult: item.aiResult || null,
  employeeName: item.employeeName || "",
  rating: item.rating || null,
  closedAt: item.closedAt || null,
  roadmap: item.roadmap || [],
  deadlineAt: item.deadlineAt,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const aiMessages = [
  "ИИ повторно анализирует фото и описание...",
  "Проверяем, не изменилось ли содержание обращения...",
  "Сверяем категорию, приоритет и дедлайн заново...",
  "Готовим новый AI-ответ для модерации...",
];

const uploadImages = async (items = []) => {
  return await Promise.all(
    (Array.isArray(items) ? items : []).map(async (item) => {
      const formData = new FormData();
      formData.append("file", item.file);
      formData.append(
        "folder",
        `cityhelp/appeals/${route.params.id}/fixed-images`,
      );

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

const loadAppeal = async () => {
  const response = await api.client({
    url: `/appeals/${route.params.id}`,
    method: "get",
  });

  appeal.value = normalizeAppeal(response?.data || response || {});
};

const loadEmployees = async () => {
  if (!canAssignEmployee.value) return;

  const response = await api.client({
    url: "/admin/users",
    method: "get",
    params: { role: "employee" },
  });

  employeeOptions.value = (response?.data || response || []).map((item) => ({
    id: item.id,
    name:
      `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
      item.name ||
      item.email,
    email: item.email,
    phone: item.phone,
    role: item.role,
  }));
};

const initialAppeal = await useFetchSsr({
  url: `/appeals/${route.params.id}`,
  method: "get",
});

appeal.value = normalizeAppeal(initialAppeal?.data || initialAppeal || {});

useSeo({ title: `Обращение №${route.params.id}` });

if (canAssignEmployee.value) {
  const initialEmployees = await useFetchSsr({
    url: "/admin/users",
    method: "get",
    params: { role: "employee" },
  });

  employeeOptions.value = (
    initialEmployees?.data ||
    initialEmployees ||
    []
  ).map((item) => ({
    id: item.id,
    name:
      `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
      item.name ||
      item.email,
    email: item.email,
    phone: item.phone,
    role: item.role,
  }));
}

const openDeleteModal = () => {
  closeActionsModal();
  isOpenDeleteModal.value = true;
};

const closeDeleteModal = () => {
  isOpenDeleteModal.value = false;
};

const openActionsModal = () => {
  isOpenActionsModal.value = true;
};

const closeActionsModal = () => {
  isOpenActionsModal.value = false;
};

const onCancel = () => {
  closeDeleteModal();
};

const onDelete = () => {
  api
    .client({
      url: `/appeals/${route.params.id}`,
      method: "delete",
    })
    .then(() => {
      useNotify({ title: "Удалено", status: "success" });
      closeDeleteModal();
      router.push("/panel");
    })
    .catch((error) => {
      useNotify({
        title: "Ошибка",
        text:
          error?.statusMessage ||
          error?.data?.statusMessage ||
          "Не удалось удалить обращение",
        status: "error",
      });
    });
};

const openAssignModal = () => {
  closeActionsModal();
  isOpenAssignModal.value = true;
};

const closeAssignModal = () => {
  isOpenAssignModal.value = false;
};

const openAiRecheckModal = async () => {
  if (isAiRecheckSubmitting.value) return;

  closeActionsModal();
  isOpenAiRecheckModal.value = true;
  isAiRecheckSubmitting.value = true;

  try {
    await api.client({
      url: `/appeals/${route.params.id}/recheck-ai`,
      method: "post",
    });

    useNotify({
      title: "AI перепроверил",
      text: "Результат обновлён",
      status: "success",
    });

    await loadAppeal();
  } catch (error) {
    useNotify({
      title: "Ошибка",
      text:
        error?.statusMessage ||
        error?.data?.statusMessage ||
        "Не удалось перепроверить обращение",
      status: "error",
    });
  } finally {
    isAiRecheckSubmitting.value = false;
    isOpenAiRecheckModal.value = false;
  }
};

const closeAiRecheckModal = () => {
  if (isAiRecheckSubmitting.value) return;
  isOpenAiRecheckModal.value = false;
};

const assignEmployee = async () => {
  if (!selectedEmployee.value?.id || isAssignSubmitting.value) return;

  isAssignSubmitting.value = true;

  try {
    await api.client({
      url: `/appeals/${route.params.id}/assign`,
      method: "post",
      body: {
        employeeId: selectedEmployee.value.id,
      },
    });

    useNotify({
      title: "Сохранено",
      text: "Сотрудник назначен",
      status: "success",
    });

    selectedEmployee.value = null;
    closeAssignModal();
    await loadAppeal();
  } catch (error) {
    useNotify({
      title: "Ошибка",
      text:
        error?.statusMessage ||
        error?.data?.statusMessage ||
        "Не удалось назначить сотрудника",
      status: "error",
    });
  } finally {
    isAssignSubmitting.value = false;
  }
};

const acceptAppeal = async () => {
  if (isEmployeeSubmitting.value) return;

  isEmployeeSubmitting.value = true;

  try {
    await api.client({
      url: `/appeals/${route.params.id}/accept`,
      method: "post",
    });

    useNotify({
      title: "Принято",
      text: "Обращение переведено в работу",
      status: "success",
    });

    await loadAppeal();
  } catch (error) {
    useNotify({
      title: "Ошибка",
      text:
        error?.statusMessage ||
        error?.data?.statusMessage ||
        "Не удалось принять обращение",
      status: "error",
    });
  } finally {
    isEmployeeSubmitting.value = false;
  }
};

const submitWork = async ({ employeeNote, files }) => {
  if (isWorkSubmitting.value) return;

  isWorkSubmitting.value = true;
  let uploaded = [];

  try {
    uploaded = await uploadImages(files);

    await api.client({
      url: `/appeals/${route.params.id}/work-submit`,
      method: "post",
      body: {
        employeeNote,
        fixedImages: uploaded,
      },
    });

    useNotify({
      title: "Отправлено",
      text: "Результат работы отправлен на проверку",
      status: "success",
    });

    await loadAppeal();
  } catch (error) {
    if (uploaded.length) {
      await deleteUploadedFiles(uploaded);
    }

    useNotify({
      title: "Ошибка",
      text:
        error?.statusMessage ||
        error?.data?.statusMessage ||
        "Не удалось отправить работу",
      status: "error",
    });
  } finally {
    isWorkSubmitting.value = false;
  }
};

const submitReview = async ({ isOk, note }) => {
  if (isReviewSubmitting.value) return;

  isReviewSubmitting.value = true;

  try {
    await api.client({
      url: `/appeals/${route.params.id}/review`,
      method: "post",
      body: {
        isOk,
        note,
      },
    });

    useNotify({
      title: "Сохранено",
      text: isOk ? "Обращение завершено" : "Обращение отправлено на доработку",
      status: "success",
    });

    await loadAppeal();
  } catch (error) {
    useNotify({
      title: "Ошибка",
      text:
        error?.statusMessage ||
        error?.data?.statusMessage ||
        "Не удалось сохранить проверку",
      status: "error",
    });
  } finally {
    isReviewSubmitting.value = false;
  }
};

const submitRating = async ({ score, comment }) => {
  if (isRatingSubmitting.value) return;

  isRatingSubmitting.value = true;

  try {
    await api.client({
      url: `/appeals/${route.params.id}/rate`,
      method: "post",
      body: {
        score,
        comment,
      },
    });

    useNotify({
      title: "Спасибо",
      text: "Оценка сохранена",
      status: "success",
    });

    await loadAppeal();
  } catch (error) {
    useNotify({
      title: "Ошибка",
      text:
        error?.statusMessage ||
        error?.data?.statusMessage ||
        "Не удалось сохранить оценку",
      status: "error",
    });
  } finally {
    isRatingSubmitting.value = false;
  }
};

onMounted(async () => {
  await loadAppeal();
  if (canAssignEmployee.value && !employeeOptions.value.length) {
    await loadEmployees();
  }
});
</script>

<style lang="scss" scoped>
.appeal {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }
  &__box {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: $gap-md;
  }
  &__top-inner {
    display: flex;
    gap: $gap-md;
    align-items: center;
  }
  &__content {
    flex-grow: 1;
    max-width: 70%;
    width: 100%;
    padding: $padding-md;
    border-radius: $border-r-md;
    display: flex;
    flex-direction: column;
    gap: $gap-md;
    &--aside {
      max-width: 60%;
    }
  }
  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $gap-md;
  }
  &__up {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 50;
  }
  &__btn {
    &--delete {
      border: 1px solid $red-300;
      color: $red-300;
      &:hover {
        background: transparent;
      }
    }
  }
  &__aside {
    position: relative;
    flex-shrink: 0;
    align-self: flex-start;
    max-width: 30%;
    width: 100%;
    padding: $padding-md;
    border-radius: $border-r-md;
    // box-shadow: $box-shadow;
    display: flex;
    flex-direction: column;
    gap: $gap-xl;
    &-inner {
      position: sticky;
      top: 20px;
      display: flex;
      flex-direction: column;
      gap: $gap-xl;
    }
    &-btn {
      width: 100%;
    }
    &--aside {
      max-width: 40%;
    }
  }
}

@media (max-width: 1200px) {
  .appeal {
    &__top {
      align-items: flex-start;
      flex-direction: column;
    }
    &__box {
      flex-direction: column;
      gap: $gap-xxl;
    }
    &__aside,
    &__content {
      max-width: 100%;
    }
    &__aside {
      position: relative;
      order: -1;
    }
  }
}
</style>
