<template>
  <section class="employee-request-card">
    <div class="employee-request-card__head">
      <div>
        <h3 class="employee-request-card__title">Сотрудничество с CityHelp</h3>
        <p class="employee-request-card__subtitle">
          Можно подать заявку на роль сотрудника. Решение принимает администратор или супер-администратор.
        </p>
      </div>
      <UiIcon icon="users-i" size="size-24" color="#606C38" />
    </div>

    <div class="employee-request-card__body">
      <div>
        <p class="employee-request-card__label">Статус</p>
        <p class="employee-request-card__value">{{ statusLabel }}</p>
        <p v-if="statusDescription" class="employee-request-card__hint">
          {{ statusDescription }}
        </p>
      </div>

      <UiButton
        v-if="showAction"
        class="primary-btn employee-request-card__button"
        label="Стать сотрудником"
        :disabled="isLoading"
        @action="emit('open')"
      />
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  role: {
    type: String,
    default: "user",
  },
  request: {
    type: Object,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["open"]);

const statusLabel = computed(() => {
  if (props.role === "superadmin") {
    return "Роль superadmin активна";
  }

  if (props.role === "admin") {
    return "Роль admin активна";
  }

  if (props.role === "employee") {
    return "Вы уже сотрудник";
  }

  if (props.request?.status === "pending") {
    return "Заявка на рассмотрении";
  }

  if (props.request?.status === "rejected") {
    return "Заявка отклонена";
  }

  if (props.request?.status === "approved") {
    return "Одобрено ранее";
  }

  return "Можно подать заявку";
});

const statusDescription = computed(() => {
  if (props.role === "superadmin" || props.role === "admin") {
    return "Для административных ролей заявка на переход в сотрудника не требуется.";
  }

  if (props.role === "employee") {
    return "Роль сотрудника уже активна, отдельная заявка больше не требуется.";
  }

  if (props.request?.status === "pending") {
    return "Заявка уже отправлена и ожидает решения администрации.";
  }

  if (props.request?.status === "rejected") {
    return props.request?.adminComment || "Вы можете отправить новую заявку повторно.";
  }

  if (props.request?.status === "approved") {
    return "Если роль позже изменили обратно, можно отправить новую заявку.";
  }

  return "После подтверждения заявка появится в отдельном списке у администрации.";
});

const showAction = computed(() => props.role === "user" && props.request?.status !== "pending");
</script>

<style lang="scss" scoped>
.employee-request-card {
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

  &__body {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: $gap-md;
  }

  &__label {
    color: $surface-500;
    font-size: 14px;
  }

  &__value {
    margin-top: 6px;
    font-size: 18px;
    font-weight: 700;
    color: $secondary-accent;
  }

  &__hint {
    margin-top: 8px;
    max-width: 560px;
    color: $surface-500;
    line-height: 1.45;
  }

  &__button {
    min-width: 220px;
  }
}

@media (max-width: 768px) {
  .employee-request-card {
    padding: $padding-lg;

    &__body {
      flex-direction: column;
      align-items: stretch;
    }

    &__button {
      width: 100%;
      min-width: 0;
    }
  }
}
</style>
