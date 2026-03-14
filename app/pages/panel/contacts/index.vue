<template>
  <section class="contacts">
    <div class="contacts__wrapper">
      <div class="contacts__border">
        <h2 class="contacts__title title-md title-point">Свяжитесь с нами:</h2>
        <ul class="contacts__ul">
          <li class="contacts__li" v-for="info in listInfo" :key="info.key">
            <p class="contacts__key">{{ info.key }}</p>
            <p class="contacts__value">{{ info.value }}</p>
          </li>
        </ul>
      </div>

      <div class="contacts__border">
        <h2 class="contacts__title title-md title-point">Социальные сети:</h2>

        <UiComminutyQR />
      </div>
    </div>
  </section>
</template>

<script setup>
useSeo({ title: "Контакты" });

const listInfo = [
  {
    key: "Телефон:",
    value: "+7 (999) 999-99-99",
  },
  {
    key: "E-mail:",
    value: "info@cityhelp.com",
  },
];
</script>

<style lang="scss" scoped>
.contacts {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }
  &__ul {
    display: flex;
    flex-wrap: wrap;
    gap: 60px;
  }
  &__li {
    display: flex;
    flex-direction: column;
    gap: $gap-sm;
  }
  &__key {
    font-weight: 500;
  }
  &__value {
    font-size: 18px;
    font-weight: 600;
  }
  &__border {
    border: 2px dashed $secondary-accent;
    padding: $padding-md;
    border-radius: $border-r-md;
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }
}
@media (max-width: 768px) {
  .contacts {
    &__ul {
      gap: $gap-xxl;
    }
  }
}
</style>
