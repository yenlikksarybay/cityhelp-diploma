<template>
  <form class="login">
    <div class="login__wrapper">
      <h1 class="login__title title-lg">Логин</h1>

      <UiInput label="E-mail*" name="email" v-model="email" />

      <UiInput
        label="Пароль*"
        type="password"
        name="password"
        v-model="password"
      />

      <p class="login__text">
        У вас нет аккаунта?
        <nuxt-link class="login__link" to="/?auth=register"
          >Зарегистрироваться</nuxt-link
        >
      </p>

      <UiButton
        class="login__btn primary-btn"
        label="Войти"
        @click="checkLogin"
      />
    </div>
  </form>
</template>

<script setup>
const authStore = useAuthStore();
const email = ref(null);
const password = ref(null);

const router = useRouter();

const checkLogin = () => {
  authStore.setAuthModal(false);
  router.push("/panel");
};
</script>

<style lang="scss" scoped>
.login {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }
  &__text {
    color: $surface-400;
    font-size: 14px;
  }
  &__title {
    text-align: center;
  }
  &__link {
    text-decoration: underline;
  }
  &__btn {
    width: 50%;
    margin-left: auto;
  }
}
</style>
