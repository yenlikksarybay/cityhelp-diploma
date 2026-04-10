<template>
  <div class="assign">
    <div class="assign__wrapper">
      <p class="assign__text">
        Выберите сотрудника, который будет отвечать за это обращение.
      </p>

      <UiSelect
        v-model="selectedEmployee"
        :options="employees"
        label="Сотрудник"
        placeholder="Выберите сотрудника"
        search-placeholder="Поиск сотрудника"
        :is-search="true"
      />

      <div class="assign__btns">
        <UiButton
          class="assign__btn secondary-btn"
          label="Отмена"
          @action="emit('close')"
        />
        <UiButton
          class="assign__btn primary-btn"
          label="Назначить"
          :disabled="!selectedEmployee || isSubmitting"
          @action="emit('save')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  employees: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: Object,
    default: null,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "close", "save"]);

const selectedEmployee = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<style lang="scss" scoped>
.assign {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }
  &__text {
    color: $surface-600;
    font-size: 14px;
  }
  &__btns {
    display: flex;
    gap: $gap-md;
    justify-content: flex-end;
  }
  &__btn {
    min-width: 140px;
  }
}
</style>
