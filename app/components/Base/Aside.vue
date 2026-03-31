<template>
  <aside
    class="aside"
    :class="{
      'aside--mobile': asideStore.isMobileOpen,
      'aside--hide': asideStore.isOpen,
    }"
  >
    <div class="aside__wrapper">
      <nav class="aside__nav">
        <ul class="aside__list aside__list--block">
          <li
            class="aside__li aside__li--first"
            :class="{
              'aside__li--end': !asideStore.isOpen || asideStore.isMobileOpen,
            }"
          >
            <!-- <UiLocale
              v-if="!asideStore.isOpen || asideStore.isMobileOpen"
              class="aside__locale"
            /> -->
            <div></div>
            <UiIcon
              class="aside__icon"
              :icon="asideStore.isOpen ? 'hamburger' : 'chevron'"
              color="black"
              size="size-24"
              :deg="asideStore.isOpen ? 'down' : 'right'"
              @click="asideStore.toggle()"
            />
            <UiIcon
              class="aside__icon aside__icon--mobile"
              icon="close"
              color="black"
              size="size-30"
              @click="asideStore.mobileToggle()"
            />
          </li>
          <li class="aside__li" v-for="list in navs" :key="list.name">
            <p
              class="aside__name"
              :class="{
                'aside__name--hide': false,
              }"
            >
              {{
                asideStore.isOpen && !asideStore.isMobileOpen
                  ? "------"
                  : list.name
              }}
            </p>
            <ul class="aside__list">
              <li
                class="aside__li"
                :class="{
                  'aside__li--active':
                    innerList.path === titleStore.currentActiveRoute,
                }"
                v-for="innerList in list.lists"
                :key="innerList.id"
              >
                <nuxt-link :to="innerList.route" class="aside__link">
                  <UiIcon
                    :icon="innerList.icon"
                    size="size-20"
                    :color="
                      innerList.path === titleStore.currentActiveRoute
                        ? 'white'
                        : 'black'
                    "
                  />
                  <p
                    class="aside__text"
                    :class="{ 'aside__text--hide': asideStore.isOpen }"
                  >
                    {{ innerList.name }}
                  </p>
                </nuxt-link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>

<script setup>
const route = useRoute();
const asideStore = useAsideStore();
const titleStore = useTitleStore();
const authStore = useAuthStore();
const user = computed(() => authStore.getUser);
const roleStore = useRoleStore();

const navs = computed(() => {
  let showNav = [
    {
      id: 1,
      name: "Основные",
      lists: [
        {
          name: "Главная",
          route: { path: "/panel" },
          path: "/panel",
          icon: "menu-i",
        },
        {
          name: "Создать обращение",
          route: { path: "/panel/create-appeal" },
          path: "/panel/create-appeal",
          icon: "plus-i",
        },
      ],
    },
    {
      id: 2,
      name: "Персональные (User)",
      lists: [
        {
          name: "Мои обращение",
          route: { path: "/panel/user/my-appeals" },
          path: "/panel/user/my-appeals",
          icon: "folders-i",
        },
      ],
    },
    {
      id: 3,
      name: "Персональные (Admin)",
      lists: [
        {
          name: "Список обращений",
          route: { path: "/panel/admin/appeals" },
          path: "/panel/admin/appeals",
          icon: "list-appeal-i",
        },
        {
          name: "Пользователи",
          route: { path: "/panel/admin/users" },
          path: "/panel/admin/users",
          icon: "users-i",
        },
        {
          name: "Сотрудники",
          route: { path: "/panel/admin/staff" },
          path: "/panel/admin/staff",
          icon: "users-i",
        },
      ],
    },
    {
      id: 4,
      name: "Персональные (Employee)",
      lists: [
        {
          name: "Обращений",
          route: { path: "/panel/employee/appeals" },
          path: "/panel/employee/appeals",
          icon: "folders-i",
        },
      ],
    },
    {
      id: 5,
      name: "Общие",
      lists: [
        {
          name: "Контакты",
          route: { path: "/panel/contacts" },
          path: "/panel/contacts",
          icon: "circle-i",
        },
        {
          name: "О 'CityHelp'",
          route: { path: "/panel/about-us" },
          path: "/panel/about-us",
          icon: "spiral-i",
        },
      ],
    },
    {
      id: 6,
      name: "Дополнительно",
      lists: [
        {
          name: "Переводы",
          route: { path: "/panel/admin/translations" },
          path: "/panel/admin/translations",
          icon: "language-i",
        },
        {
          name: "AI Промты",
          route: { path: "/panel/admin/prompts" },
          path: "/panel/admin/prompts",
          icon: "ai-i",
        },
      ],
    },
  ];

  if (!roleStore.isStudent) {
    // showNav.push({
    //   id: 2,
    //   name: t("Дополнительно"),
    //   lists: [
    //     {
    //       name: t("Статистика"),
    //       route: { path: "/statistics" },
    //       path: "/statistics",
    //       icon: "statistics-i",
    //     },
    //     {
    //       name: t("Ученики"),
    //       route: { path: "/students" },
    //       path: "/students",
    //       icon: "users-i",
    //     },
    //     {
    //       name: t("Результат школы"),
    //       route: { path: "/school-results" },
    //       path: "/school-results",
    //       icon: "paper-check",
    //     },
    //     {
    //       name: t("Методика"),
    //       route: { path: "/methodology" },
    //       path: "/methodology",
    //       icon: "lampa-i",
    //     },
    //   ],
    // });
  }

  return showNav;
});

onMounted(() => {
  !localStorage.getItem("isOpenAside") ? asideStore.setOpen(true) : null;
});

const closeMobileAside = () => {
  asideStore.isMobileOpen = false;
};

watch(
  () => route.fullPath,
  () => {
    closeMobileAside();
  },
);
</script>

<style lang="scss" scoped>
.aside {
  max-width: 270px;
  width: 100%;
  transition: 0.225s max-width;
  &--hide {
    max-width: 61px;
  }
  &__wrapper {
    width: 100%;
    background-color: $white;
    border-radius: $border-r-md;
    padding: $padding-sm 0;
    box-shadow: $box-shadow;
    overflow-y: scroll;
    max-height: 650px;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0ch;
      height: 0px;
    }
  }
  &__name {
    font-size: 16px;
    font-weight: 500;
    color: $surface-300;
    margin-bottom: 16px;
    white-space: nowrap;
    &--hide {
      opacity: 0;
    }
  }
  &__list {
    display: flex;
    flex-direction: column;
    // gap: $gap-xs;
  }
  &__link {
    display: flex;
    gap: $gap-md;
    align-items: center;
  }
  &__locale {
    visibility: hidden;
  }
  &__icon {
    &--mobile {
      display: none;
    }
  }
  &__text {
    font-weight: 500;
    color: $surface-400;
    white-space: nowrap;
    transition: 0.2s opacity;
    &--hide {
      display: none;
    }
  }
  &__li {
    padding: $padding-sm;
    border-radius: $border-r-md;
    &--first {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    &--end {
      justify-content: space-between;
    }
    &--active {
      background-color: $secondary-accent; // ???
      & .aside__text {
        color: $white;
      }
    }
  }
}

@media (max-width: 768px) {
  .aside {
    display: none;
    &--mobile {
      max-width: 100%;
      width: 100%;
      height: 100vh;
      background-color: $white;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &__wrapper {
      max-width: 450px;
    }
    &__text {
      &--hide {
        display: block;
      }
    }
    &__locale {
      visibility: visible;
      display: block;
    }
    &__icon {
      display: none;
      &--mobile {
        display: block;
      }
    }
  }
}
</style>
