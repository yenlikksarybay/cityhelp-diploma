<template>
  <section class="sms-code">
    <div class="sms-code__wrapper">
      <h4 class="sms-code__title title-md">СМС-код</h4>

      <div class="sms-code__box">
        <p class="sms-code__message">Введите СМС-код отправленный на почту</p>
        <p class="sms-code__number">{{ email }}</p>
      </div>

      <client-only>
        <form class="sms-code__form">
          <venCodeInput
            v-model.trim="sms"
            :upper="true"
            :lower="false"
            :length="4"
            :disallow="/[^a-zA-Z0-9]/g"
            :class="{ error: errorSms ? 'sms-code__fields-error' : '' }"
            class="sms-code__sms"
          />
          <p class="sms-code__error" v-if="errorSms">
            {{ errorSms }}
          </p>
          <div class="sms-code__btns">
            <UiButton
              label="Назад"
              class="sms-code__btn secondary-btn"
              @click="emit('prevStep')"
            />
            <UiButton
              label="Подтвердить"
              class="sms-code__btn primary-btn"
              @click="postLogin"
              :disabled="disabledBtn"
              :is-loading="isLoading"
            />
          </div>
        </form>
      </client-only>
    </div>
  </section>
</template>

<script setup>
const authStore = useAuthStore();
const emit = defineEmits(["nextStep", "prevStep"]);

const route = useRoute();
const router = useRouter();

const props = defineProps({
  email: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
});

const sms = ref(null);
const errorSms = ref("");
const isLoading = ref(false);

const disabledBtn = computed(() => {
  return !(sms.value?.length === 4);
});

const postLogin = () => {
  authStore.setAuthModal(false);
  router.push("/panel");
  return;
  if (!disabledBtn.value) {
    isLoading.value = true;
    useApi({
      url:
        route.query?.["reset-password"] !== null
          ? "/users/auth/register/verify-code"
          : "/users/verify-reset-code",
      method: "post",
      data: {
        phone: props.phone.replace(/\D/g, ""),
        code: sms.value,
      },
    })
      .then((res) => {
        emit("nextStep", res.userId);
        isLoading.value = false;
      })
      .catch((error) => {
        errorSms.value = error.message;
        sms.value = null;
        isLoading.value = false;
      });
  }
};

watch(
  () => sms.value,
  (newVal) => {
    if (newVal?.length >= 1 && errorSms.value) errorSms.value = "";
  },
);
</script>

<style lang="scss" scoped>
.sms-code {
  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 26px;
    padding: $padding-md;
  }
  &__form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  &__sms {
    max-width: 200px;
    margin: 0 auto;
  }
  &__error {
    color: $red-300;
    font-size: 14px;
    transform: translateY(-15px);
  }
  &__fields-error {
    border: 1px solid $red-300;
  }
  &__btns {
    display: flex;
    gap: 6px;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  &__btn {
    width: 100%;

    &--cancel {
      display: flex;
      justify-content: center;
      background-color: transparent;
      color: $surface-600;
    }
  }
  &__box {
    text-align: center;
  }
  &__logo {
    width: 64px;
  }
}

:global(.code-field__input) {
  background-color: $white !important;
  border: 1px solid $surface-300;
  color: $surface-600;
}
</style>
