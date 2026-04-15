<template>
  <section class="avatar-card">
    <div class="avatar-card__head">
      <div>
        <h3 class="avatar-card__title">Аватар</h3>
        <p class="avatar-card__subtitle">Загрузите изображение профиля.</p>
      </div>
      <UiIcon icon="user-i" size="size-24" color="#606C38" />
    </div>

    <UiFileUpload
      v-model="selectedFile"
      :preview-src="avatarSrc"
      :preview-name="avatarName"
      @invalid-file="emit('invalid-file')"
      @delete-preview="emit('delete')"
    />

    <div class="avatar-card__meta">
      <p class="avatar-card__meta-item">
        <span class="avatar-card__meta-label">Текущий файл:</span>
        <span class="avatar-card__meta-value">
          {{ avatarName || "Не загружен" }}
        </span>
      </p>
      <p class="avatar-card__meta-item">
        <span class="avatar-card__meta-label">Форматы:</span>
        <span class="avatar-card__meta-value">JPG, PNG, WEBP до 4.5 MB</span>
      </p>
      <p v-if="selectedFile?.name" class="avatar-card__meta-item">
        <span class="avatar-card__meta-label">Новый файл:</span>
        <span class="avatar-card__meta-value">{{ selectedFile.name }}</span>
      </p>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
  avatarSrc: {
    type: String,
    default: "",
  },
  avatarName: {
    type: String,
    default: "",
  },
  isUploading: {
    type: Boolean,
    default: false,
  },
  isDeleting: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "update:modelValue",
  "delete",
  "invalid-file",
]);

const selectedFile = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<style lang="scss" scoped>
.avatar-card {
  padding: $padding-xl;
  border-radius: $border-r-lg;
  background: $white;
  box-shadow: $box-shadow;
  display: flex;
  flex-direction: column;
  gap: $gap-lg;

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: $gap-md;
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
  }

  &__subtitle {
    margin-top: 6px;
    color: $surface-500;
    line-height: 1.45;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: $padding-md;
    border-radius: $border-r-md;
    background: $surface-100;
  }

  &__meta-item {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    font-size: 14px;
  }

  &__meta-label {
    color: $surface-400;
  }

  &__meta-value {
    font-weight: 600;
  }
}

@media (max-width: 768px) {
  .avatar-card {
    padding: $padding-lg;
  }
}
</style>
