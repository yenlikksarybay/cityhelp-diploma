<template>
  <section class="api-docs">
    <div class="api-docs__hero">
      <div>
        <h2 class="api-docs__title">Api документация</h2>
        <p class="api-docs__subtitle">
          Краткий обзор всех endpoint’ов платформы: для чего нужен, какие query
          и body принимает и что возвращает.
        </p>
      </div>
    </div>

    <div class="api-docs__content">
      <aside class="api-docs__sidebar">
        <p class="api-docs__sidebar-title">Разделы</p>
        <a
          v-for="section in sections"
          :key="section.id"
          class="api-docs__sidebar-link"
          :href="`#${section.id}`"
        >
          {{ section.title }}
          <span>{{ section.endpoints.length }}</span>
        </a>
      </aside>

      <div class="api-docs__sections">
        <section
          v-for="section in sections"
          :id="section.id"
          :key="section.id"
          class="api-docs__section"
        >
          <div class="api-docs__section-head">
            <div>
              <h3 class="api-docs__section-title">{{ section.title }}</h3>
              <p class="api-docs__section-description">
                {{ section.description }}
              </p>
            </div>
            <span class="api-docs__section-count"
              >{{ section.endpoints.length }} endpoint</span
            >
          </div>

          <div class="api-docs__cards">
            <article
              v-for="item in section.endpoints"
              :key="`${item.method}-${item.endpoint}`"
              class="api-docs__card"
            >
              <div class="api-docs__card-head">
                <div
                  class="api-docs__method"
                  :class="`is-${item.method.toLowerCase()}`"
                >
                  {{ item.method }}
                </div>
                <code class="api-docs__endpoint">{{ item.endpoint }}</code>
                <span
                  v-if="accessMeta[item.access]"
                  class="api-docs__access"
                  :class="accessMeta[item.access].tone"
                >
                  {{ accessMeta[item.access].label }}
                </span>
              </div>

              <p class="api-docs__purpose">{{ item.purpose }}</p>

              <div class="api-docs__meta-grid">
                <div v-if="item.query?.length" class="api-docs__meta-card">
                  <p class="api-docs__meta-title">Query</p>
                  <ul class="api-docs__list">
                    <li v-for="queryItem in item.query" :key="queryItem">
                      {{ queryItem }}
                    </li>
                  </ul>
                </div>

                <div v-if="item.body?.length" class="api-docs__meta-card">
                  <p class="api-docs__meta-title">Body</p>
                  <ul class="api-docs__list">
                    <li v-for="bodyItem in item.body" :key="bodyItem">
                      {{ bodyItem }}
                    </li>
                  </ul>
                </div>

                <div class="api-docs__meta-card">
                  <p class="api-docs__meta-title">Response</p>
                  <ul class="api-docs__list">
                    <li
                      v-for="responseItem in item.response"
                      :key="responseItem"
                    >
                      {{ responseItem }}
                    </li>
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup>
import { API_ACCESS_META, API_DOC_SECTIONS } from "~/constants/apiDocs";

definePageMeta({
  layout: "docs",
});

useSeo({
  title: "Api документация",
  description:
    "Открытая страница с краткой документацией API платформы CityHelp: endpoint’ы, query, body и ответы.",
});

const sections = API_DOC_SECTIONS;
const accessMeta = API_ACCESS_META;
</script>

<style lang="scss" scoped>
.api-docs {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__hero {
    padding: 28px;
    border-radius: 28px;
    background: linear-gradient(
      135deg,
      rgba($secondary-accent, 0.1),
      rgba($white, 0.94)
    );
    box-shadow: $box-shadow;
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(280px, 0.8fr);
    gap: 20px;
  }

  &__eyebrow {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: $surface-500;
  }

  &__title {
    margin-top: 8px;
    font-size: clamp(32px, 4vw, 52px);
    line-height: 1;
    font-weight: 800;
  }

  &__subtitle {
    margin-top: 14px;
    color: $surface-600;
    line-height: 1.6;
    max-width: 760px;
  }

  &__hero-note {
    padding: 18px;
    border-radius: 20px;
    background: rgba($white, 0.82);
    color: $surface-600;
    line-height: 1.55;
    align-self: stretch;

    code {
      font-size: 14px;
    }
  }

  &__content {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 24px;
    align-items: start;
  }

  &__sidebar {
    position: sticky;
    top: 20px;
    padding: 20px;
    border-radius: 24px;
    background: rgba($white, 0.88);
    box-shadow: $box-shadow;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__sidebar-title {
    font-size: 14px;
    font-weight: 700;
    color: $surface-500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 4px;
  }

  &__sidebar-link {
    padding: 12px 14px;
    border-radius: 16px;
    background: $surface-100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    color: $surface-600;
    transition: 0.2s ease;

    span {
      min-width: 28px;
      height: 28px;
      border-radius: 999px;
      background: rgba($secondary-accent, 0.12);
      color: $secondary-accent;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
    }

    &:hover {
      background: rgba($secondary-accent, 0.08);
    }
  }

  &__sections {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__section {
    padding: 24px;
    border-radius: 28px;
    background: rgba($white, 0.9);
    box-shadow: $box-shadow;
    scroll-margin-top: 24px;
  }

  &__section-head {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    margin-bottom: 18px;
  }

  &__section-title {
    font-size: 28px;
    font-weight: 800;
  }

  &__section-description {
    margin-top: 8px;
    color: $surface-500;
    line-height: 1.5;
  }

  &__section-count {
    padding: 10px 14px;
    border-radius: 999px;
    background: rgba($secondary-accent, 0.1);
    color: $secondary-accent;
    font-size: 13px;
    font-weight: 700;
    white-space: nowrap;
  }

  &__cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__card {
    padding: 18px;
    border: 1px solid rgba($secondary-accent, 0.12);
    border-radius: 22px;
    background: linear-gradient(
      180deg,
      rgba($white, 0.96),
      rgba($surface-100, 0.72)
    );
  }

  &__card-head {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__method,
  &__access {
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__method {
    color: $white;

    &.is-get {
      background: $http-get-color;
    }

    &.is-post {
      background: $http-post-color;
    }

    &.is-patch {
      background: $http-patch-color;
    }

    &.is-delete {
      background: $http-delete-color;
    }
  }

  &__endpoint {
    padding: 8px 12px;
    border-radius: 12px;
    background: $surface-100;
    color: $surface-600;
    font-size: 14px;
    font-weight: 700;
  }

  &__access {
    color: $surface-600;

    &.is-public {
      background: #d8f3dc;
    }

    &.is-auth {
      background: #e9ecef;
    }

    &.is-user {
      background: #fff3bf;
    }

    &.is-employee {
      background: #dbeafe;
    }

    &.is-admin {
      background: #fde2e4;
    }
  }

  &__purpose {
    margin-top: 12px;
    color: $surface-600;
    line-height: 1.55;
  }

  &__meta-grid {
    margin-top: 16px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  &__meta-card {
    padding: 14px;
    border-radius: 18px;
    background: rgba($white, 0.9);
    border: 1px solid $surface-150;
  }

  &__meta-title {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $surface-500;
    margin-bottom: 10px;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: $surface-600;
    line-height: 1.45;
  }
}

@media (max-width: 1080px) {
  .api-docs {
    &__content {
      grid-template-columns: 1fr;
    }

    &__sidebar {
      position: static;
    }
  }
}

@media (max-width: 860px) {
  .api-docs {
    &__hero {
      grid-template-columns: 1fr;
      padding: 22px;
    }

    &__section {
      padding: 20px;
    }

    &__meta-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
