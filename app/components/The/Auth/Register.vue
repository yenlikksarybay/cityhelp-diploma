<template>
  <form class="register">
    <div class="register__wrapper">
      <h1 class="register__title title-lg">Регистрация</h1>
      <div class="register__box">
        <UiInput label="Имя*" name="firstName" v-model="form.firstName" />
        <UiInput label="Фамилия*" name="lastName" v-model="form.lastName" />
      </div>
      <UiInput label="E-mail*" name="email" v-model="form.email" />

      <UiInput
        label="Телефон*"
        maska="+7(###)-###-##-##"
        placeholder="+7 (_ _ _) - _ _ _ - _ _ - _ _"
        name="phone"
        v-model="form.phone"
        :max-length="17"
      />

      <UiInput
        label="Пароль*"
        type="password"
        name="password"
        v-model="form.password"
      />
      <UiInput
        label="Подвервите пароль*"
        type="password"
        name="confirmPassword"
        v-model="form.confirmPassword"
      />

      <p class="register__text">
        У вас уже есть аккаунт?
        <nuxt-link class="register__link" to="/?auth=login">Логин</nuxt-link>
      </p>

      <UiButton
        class="register__btn primary-btn"
        label="Зарегистрироваться"
        :is-loading="isLoading"
        @action="checkRegister"
        @keyup.enter="checkRegister"
      />
    </div>
  </form>
</template>

<script setup>
const authStore = useAuthStore();
const isLoading = ref(false);
const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

const checkRegister = async () => {
  if (!Object.values(form).every(Boolean)) {
    useNotify({ title: "Ошибка", text: "Заполните все поля", status: "error" });
    return;
  }

  if (form.password !== form.confirmPassword) {
    useNotify({
      title: "Ошибка",
      text: "Пароли не совпадают",
      status: "error",
    });
    return;
  }

  try {
    isLoading.value = true;
    const res = await useApi().client({
      url: "/auth/register",
      method: "post",
      body: form,
    });

    await authStore.setToken(res?.data?.token, "/panel");
    authStore.setAuthModal(false);
  } catch (error) {
    console.log(error);
    useNotify({
      title: "Не удалось зарегистрироваться",
      text:
        error._data?.statusMessage ||
        error._data?.message ||
        "Проверьте поля формы",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.register {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }
  &__box {
    display: flex;
    align-items: center;
    gap: $gap-md;
  }
  &__title {
    text-align: center;
  }
  &__btn {
    width: 50%;
    margin-left: auto;
  }
  &__text {
    color: $surface-400;
    font-size: 14px;
  }
  &__link {
    text-decoration: underline;
  }
}

@media (max-width: 768px) {
  .register {
    &__box {
      flex-direction: column;
    }
  }
}
</style>
