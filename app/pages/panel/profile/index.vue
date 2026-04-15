<template>
  <section class="profile-page">
    <div class="profile-page__hero">
      <div class="profile-page__hero-avatar">
        <img
          v-if="avatarSrc"
          :src="avatarSrc"
          :alt="profileName"
          class="profile-page__hero-image"
        />
        <div v-else class="profile-page__hero-placeholder">
          {{ profileInitials }}
        </div>
      </div>

      <div class="profile-page__hero-content">
        <h2 class="profile-page__title">{{ profileName }}</h2>
        <div class="profile-page__meta">
          <span class="profile-page__pill">{{ profile.role || "user" }}</span>
          <span class="profile-page__pill profile-page__pill--muted">
            Обновлено: {{ formatDateToDots(profile.updatedAt) || "—" }}
          </span>
        </div>
      </div>
    </div>

    <ThePanelProfileEmployeeRequestCard
      :role="profile.role"
      :request="profile.employeeRequest"
      :is-loading="isEmployeeRequestSaving"
      @open="openEmployeeModal"
    />

    <div class="profile-page__grid">
      <ThePanelProfileAvatarCard
        v-model="avatarFile"
        :avatar-src="avatarSrc"
        :avatar-name="avatarName"
        :is-uploading="isAvatarSaving"
        :is-deleting="isAvatarDeleting"
        @delete="deleteAvatar"
        @invalid-file="onInvalidFile"
      />

      <ThePanelProfileInfoCard
        v-model="profileForm"
        :is-saving="isProfileSaving || isAvatarSaving"
        @save="saveProfile"
      />
    </div>

    <ThePanelProfilePasswordCard
      v-model="passwordForm"
      :is-saving="isPasswordSaving"
      @save="savePassword"
    />

    <UiModal
      :is-open="isEmployeeModalOpen"
      max-width="520px"
      title="Стать сотрудником"
      @close="closeEmployeeModal"
    >
      <BecomeEmployeeModal
        :is-loading="isEmployeeRequestSaving"
        @close="closeEmployeeModal"
        @confirm="submitEmployeeRequest"
      />
    </UiModal>
  </section>
</template>

<script setup>
import ThePanelProfileAvatarCard from "~/components/The/Panel/Profile/AvatarCard.vue";
import BecomeEmployeeModal from "~/components/Modals/BecomeEmployee.vue";
import ThePanelProfileEmployeeRequestCard from "~/components/The/Panel/Profile/EmployeeRequestCard.vue";
import ThePanelProfileInfoCard from "~/components/The/Panel/Profile/InfoCard.vue";
import ThePanelProfilePasswordCard from "~/components/The/Panel/Profile/PasswordCard.vue";

const api = useApi();
const authStore = useAuthStore();
useSeo({ title: "Профиль" });

const profile = ref({});
const avatarFile = ref(null);
const isProfileSaving = ref(false);
const isAvatarSaving = ref(false);
const isAvatarDeleting = ref(false);
const isPasswordSaving = ref(false);
const isEmployeeRequestSaving = ref(false);
const isEmployeeModalOpen = ref(false);

const profileForm = ref({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
});

const passwordForm = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const profileName = computed(() => {
  return (
    profile.value?.name ||
    `${profile.value?.firstName || ""} ${profile.value?.lastName || ""}`.trim() ||
    "Профиль"
  );
});

const avatarSrc = computed(
  () => profile.value?.avatar?.url || profile.value?.avatarUrl || "",
);
const avatarName = computed(() => profile.value?.avatar?.name || "");
const profileInitials = computed(() => {
  const first = profile.value?.firstName?.trim()?.[0] || "";
  const last = profile.value?.lastName?.trim()?.[0] || "";

  if (first || last) {
    return `${first}${last}`.toUpperCase();
  }

  return profileName.value?.[0]?.toUpperCase() || "";
});

const fillProfile = (data = {}) => {
  profile.value = data || {};
  profileForm.value = {
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    phone: data.phone || "",
    email: data.email || "",
  };
};

const initialResponse = await useFetchSsr({
  url: "/profile",
  method: "get",
});

fillProfile(initialResponse?.data || initialResponse || {});

const refreshProfile = async () => {
  const response = await api.client({
    url: "/profile",
    method: "get",
  });

  const data = response?.data || response || {};
  fillProfile(data);
};

const openEmployeeModal = () => {
  if (isEmployeeRequestSaving.value) return;
  isEmployeeModalOpen.value = true;
};

const closeEmployeeModal = () => {
  if (isEmployeeRequestSaving.value) return;
  isEmployeeModalOpen.value = false;
};

const saveProfile = async () => {
  if (isProfileSaving.value || isAvatarSaving.value) return;

  const hasAvatarToUpload = Boolean(avatarFile.value);

  try {
    isProfileSaving.value = true;
    const response = await api.client({
      url: "/profile",
      method: "patch",
      body: {
        firstName: profileForm.value.firstName,
        lastName: profileForm.value.lastName,
      },
    });

    let nextProfile = response?.data || response || {};

    if (hasAvatarToUpload) {
      isAvatarSaving.value = true;
      const formData = new FormData();
      formData.append("file", avatarFile.value);

      const avatarResponse = await api.client({
        url: "/profile/avatar",
        method: "post",
        body: formData,
      });

      avatarFile.value = null;
      nextProfile = avatarResponse?.data || avatarResponse || nextProfile;
    }

    fillProfile(nextProfile);
    await authStore.setUser();

    useNotify({
      title: "Профиль обновлён",
      text: hasAvatarToUpload
        ? "Данные профиля и аватар успешно сохранены."
        : "Имя и фамилия успешно сохранены.",
      status: "success",
    });
  } catch (error) {
    useNotify({
      title: "Не удалось сохранить профиль",
      text: error?.statusMessage || "Проверьте данные и попробуйте ещё раз.",
      status: "error",
    });
  } finally {
    isProfileSaving.value = false;
    isAvatarSaving.value = false;
  }
};

const deleteAvatar = async () => {
  if (isAvatarDeleting.value || !avatarSrc.value) return;

  try {
    isAvatarDeleting.value = true;
    const response = await api.client({
      url: "/profile/avatar",
      method: "delete",
    });

    avatarFile.value = null;
    fillProfile(response?.data || response || {});
    await authStore.setUser();

    useNotify({
      title: "Аватар удалён",
      text: "Фотография профиля удалена из хранилища.",
      status: "success",
    });
  } catch (error) {
    useNotify({
      title: "Не удалось удалить аватар",
      text: error?.statusMessage || "Попробуйте ещё раз.",
      status: "error",
    });
  } finally {
    isAvatarDeleting.value = false;
  }
};

const savePassword = async () => {
  if (isPasswordSaving.value) return;

  try {
    isPasswordSaving.value = true;
    await api.client({
      url: "/profile/password",
      method: "post",
      body: {
        oldPassword: passwordForm.value.oldPassword,
        newPassword: passwordForm.value.newPassword,
        confirmPassword: passwordForm.value.confirmPassword,
      },
    });

    passwordForm.value = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    useNotify({
      title: "Пароль обновлён",
      text: "Новый пароль успешно сохранён.",
      status: "success",
    });
  } catch (error) {
    useNotify({
      title: "Не удалось обновить пароль",
      text:
        error?.statusMessage ||
        "Проверьте текущий пароль и попробуйте ещё раз.",
      status: "error",
    });
  } finally {
    isPasswordSaving.value = false;
  }
};

const submitEmployeeRequest = async () => {
  if (isEmployeeRequestSaving.value) return;

  try {
    isEmployeeRequestSaving.value = true;
    await api.client({
      url: "/profile/employee-request",
      method: "post",
    });

    isEmployeeModalOpen.value = false;
    await refreshProfile();
    await authStore.setUser();

    useNotify({
      title: "Заявка отправлена",
      text: "Теперь она доступна администрации в разделе заявок на сотрудничество.",
      status: "success",
    });
  } catch (error) {
    useNotify({
      title: "Не удалось отправить заявку",
      text: error?.statusMessage || "Попробуйте ещё раз чуть позже.",
      status: "error",
    });
  } finally {
    isEmployeeRequestSaving.value = false;
  }
};

const onInvalidFile = () => {
  useNotify({
    title: "Неверный файл",
    text: "Загрузите изображение до 4.5 MB в формате JPG, PNG или WEBP.",
    status: "error",
  });
};
</script>

<style lang="scss" scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: $gap-xxl;

  &__hero {
    display: flex;
    gap: $gap-xl;
    align-items: center;
    padding: $padding-xl;
    border-radius: $border-r-lg;
    background: linear-gradient(
      135deg,
      rgba($secondary-accent, 0.08),
      rgba($surface-100, 0.8)
    );
    box-shadow: $box-shadow;
  }

  &__hero-avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    background: $white;
    box-shadow: 0 12px 30px rgba($secondary-accent, 0.12);
  }

  &__hero-image,
  &__hero-placeholder {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__hero-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: $secondary-accent;
    color: $white;
    font-size: 28px;
    font-weight: 700;
  }

  &__hero-content {
    display: flex;
    flex-direction: column;
    gap: $gap-sm;
  }

  &__eyebrow {
    color: $secondary-accent;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 12px;
  }

  &__title {
    font-size: 30px;
    font-weight: 800;
  }

  &__text {
    color: $surface-500;
    max-width: 760px;
    line-height: 1.6;
  }

  &__meta {
    display: flex;
    gap: $gap-sm;
    flex-wrap: wrap;
    margin-top: 4px;
  }

  &__pill {
    padding: 8px 14px;
    border-radius: 999px;
    background: rgba($secondary-accent, 0.12);
    color: $secondary-accent;
    font-size: 13px;
    font-weight: 700;

    &--muted {
      background: $surface-150;
      color: $surface-600;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
    gap: $gap-xxl;
    align-items: start;
  }
}

@media (max-width: 960px) {
  .profile-page {
    &__hero {
      flex-direction: column;
      align-items: flex-start;
    }

    &__grid {
      grid-template-columns: 1fr;
    }
  }
}

@media (max-width: 640px) {
  .profile-page {
    &__hero {
      padding: $padding-lg;
    }

    &__title {
      font-size: 24px;
    }
  }
}
</style>
