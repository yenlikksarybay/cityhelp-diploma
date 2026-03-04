<template>
  <form class="register">
    <div class="register__wrapper">
      <h1 class="register__title title-lg">Регистрация</h1>
      <div class="register__box">
        <UiInput label="Имя*" name="firstName" />
        <UiInput label="Фамилия*" name="lastName" />
      </div>
      <UiInput label="E-mail*" name="email" />

      <UiInput
        label="Телефон*"
        maska="+7(###)-###-##-##"
        placeholder="+7 (_ _ _) - _ _ _ - _ _ - _ _"
        name="phone"
        :max-length="17"
      />

      <UiInput label="Пароль*" name="password" />
      <UiInput label="Подвервите пароль*" name="confirmPassword" />

      <p class="register__text">
        У вас уже есть аккаунт?
        <nuxt-link class="register__link" to="/?auth=login">Логин</nuxt-link>
      </p>

      <UiButton
        class="register__btn primary-btn"
        label="Зарегистрироваться"
        @click="checkRegister"
      />
    </div>
  </form>
</template>

<script setup>
const authStore = useAuthStore();

const router = useRouter();

const checkRegister = () => {
  authStore.setAuthModal(false);

  router.push("/panel");
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
