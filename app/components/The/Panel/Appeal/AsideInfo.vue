<template>
  <div class="info">
    <div class="info__wrapper">
      <h4 class="info__title title-md title-point">Информация</h4>
      <ul class="info__ul">
        <li class="info__li" v-for="list in lists" :key="list.key">
          <p class="info__key">{{ list.key }}</p>
          <UiStatus
            class="info__value"
            v-if="list?.status"
            :status="list.status"
            :text="list.value"
          />
          <UiStatusText
            class="info__value"
            v-else-if="list?.level"
            :status="list.level"
            :text="list.value"
          />
          <p class="info__value" v-else>{{ list.value }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
useSeo({ title: "Обращение 2" });

const lists = [
  {
    key: "От пользователя:",
    value: "Yenlik Sarybay",
  },
  {
    key: "Местоположение:",
    value: "Көктем 3",
  },
  {
    key: "Категория:",
    value: "Служба городского управления",
  },
  {
    key: "Статус:",
    value: "",
    status: "pending",
  },
  {
    key: "Проритетность:",
    value: "Высокая",
    level: "rejected",
  },
  {
    key: "Дата создание:",
    value: "11.3.2026",
  },
  {
    key: "Дата закрытия:",
    value: "11.3.2026",
  },
];
</script>

<style lang="scss" scoped>
.info {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }
  &__ul {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }
  &__li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $gap-xs;
  }
  &__value {
    font-weight: 500;
    text-align: right;
    // white-space: nowrap;
  }
}
</style>
