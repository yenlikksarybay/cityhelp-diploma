<template>
  <section class="answer">
    <div class="answer__wrapper">
      <h4 class="answer__title title-md title-point">Ответ на обращение</h4>

      <div v-if="text" class="answer__box">
        <div class="answer__top">
          <p class="answer__role">
            {{ authorLabel }} - <span class="answer__baige">{{ authorName }}</span>
          </p>
          <p class="answer__date">
            {{ formatDateTime(props.appeal?.updatedAt || props.appeal?.createdAt) }}
          </p>
        </div>
        <p class="answer__comment">{{ text }}</p>
        <div v-if="props.appeal?.aiResult?.photoObservation" class="answer__vision">
          <p class="answer__vision-title">Что увидел AI на фото</p>
          <p class="answer__vision-text">{{ props.appeal.aiResult.photoObservation }}</p>
        </div>
        <div v-if="props.appeal?.aiResult?.analysisSummary" class="answer__vision">
          <p class="answer__vision-title">Как AI объяснил решение</p>
          <p class="answer__vision-text">{{ props.appeal.aiResult.analysisSummary }}</p>
        </div>
        <div v-if="confidenceItems.length" class="answer__vision">
          <p class="answer__vision-title">Уверенность AI</p>
          <div class="answer__confidence-list">
            <span
              v-for="item in confidenceItems"
              :key="item.key"
              class="answer__confidence"
              :class="`answer__confidence--${item.level}`"
            >
              {{ item.label }}: {{ item.value }}%
            </span>
          </div>
          <p v-if="props.appeal?.aiResult?.needsCarefulReview" class="answer__vision-text">
            Требует внимательной проверки модератором.
          </p>
        </div>
        <div v-if="candidateCategories.length" class="answer__vision">
          <p class="answer__vision-title">Shortlist категорий до Gemini</p>
          <div class="answer__candidate-list">
            <span
              v-for="item in candidateCategories"
              :key="item.key"
              class="answer__candidate"
            >
              {{ item.name || item.key }} · {{ item.score }}
            </span>
          </div>
        </div>
        <div v-if="props.appeal?.aiResult?.photoDetails?.length" class="answer__vision">
          <p class="answer__vision-title">Подробности на фото</p>
          <ul class="answer__list">
            <li
              v-for="(item, index) in props.appeal.aiResult.photoDetails"
              :key="`photo-detail-${index}`"
              class="answer__list-item"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div
          v-if="props.appeal?.aiResult?.evidence?.length"
          class="answer__vision"
        >
          <p class="answer__vision-title">На чём основан вывод</p>
          <ul class="answer__list">
            <li
              v-for="(item, index) in props.appeal.aiResult.evidence"
              :key="`evidence-${index}`"
              class="answer__list-item"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div
          v-if="props.appeal?.aiResult?.uncertainties?.length"
          class="answer__vision"
        >
          <p class="answer__vision-title">Что AI не смог точно определить</p>
          <ul class="answer__list">
            <li
              v-for="(item, index) in props.appeal.aiResult.uncertainties"
              :key="`uncertainty-${index}`"
              class="answer__list-item"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div v-if="props.appeal?.aiResult?.decision" class="answer__vision">
          <p class="answer__vision-title">Почему AI так решил</p>
          <ul class="answer__reasons">
            <li
              v-for="item in decisionReasons"
              :key="item.key"
              class="answer__reason"
            >
              <span class="answer__reason-label">{{ item.label }}</span>
              <span class="answer__reason-value">{{ item.value }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="timeline.length" class="answer__timeline">
        <div class="answer__timeline-head">
          <h5 class="answer__timeline-title">История обращения</h5>
        </div>
        <div class="answer__steps">
          <article
            v-for="(item, index) in timeline"
            :key="`${item.type}-${index}-${item.createdAt}`"
            class="answer__step"
          >
            <div class="answer__step-head">
              <div class="answer__step-meta">
                <p class="answer__step-title">{{ item.title || 'Комментарий' }}</p>
                <p class="answer__step-author">
                  {{ item.authorName || roleLabel(item.role) }}
                </p>
              </div>
              <p class="answer__step-date">{{ formatDateTime(item.createdAt) }}</p>
            </div>
            <p v-if="item.text" class="answer__step-text">{{ item.text }}</p>
            <div v-if="item.statusFrom || item.statusTo" class="answer__step-status">
              <span v-if="item.statusFrom">{{ statusText(item.statusFrom) }}</span>
              <UiIcon icon="arrow-i" size="size-16" />
              <span v-if="item.statusTo">{{ statusText(item.statusTo) }}</span>
            </div>
            <div v-if="item.meta && Object.keys(item.meta).length" class="answer__step-meta-list">
              <p
                v-for="metaItem in formatMeta(item.meta)"
                :key="metaItem.key"
                class="answer__step-meta-item"
              >
                <span class="answer__step-meta-key">{{ metaItem.label }}:</span>
                <span class="answer__step-meta-value">{{ metaItem.value }}</span>
              </p>
            </div>
          </article>
        </div>
      </div>

      <div v-else class="answer__empty">
        Пока нет ответа
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  appeal: {
    type: Object,
    default: null,
  },
});

const timeline = computed(() => (props.appeal?.timeline || []).slice().sort(
  (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
));

const authorLabel = computed(() => {
  const latest = [...timeline.value].pop();
  if (latest?.role === "ai") return "AI";
  if (latest?.role === "employee") return "Сотрудник";
  if (latest?.role === "admin") return "Администратор";
  if (props.appeal?.employeeNote) return "Сотрудник";
  if (props.appeal?.moderationNote) return "Администратор";
  return "AI";
});

const authorName = computed(() => {
  const latest = [...timeline.value].pop();
  if (latest?.authorName) return latest.authorName;
  return props.appeal?.assignedEmployee?.name || "CityHelp";
});

const text = computed(() => {
  return (
    props.appeal?.aiResult?.shortSummary ||
    props.appeal?.employeeNote ||
    props.appeal?.moderationNote ||
    ""
  );
});

const roleLabel = (role) => {
  switch (role) {
    case "ai":
      return "AI";
    case "employee":
      return "Сотрудник";
    case "admin":
      return "Администратор";
    default:
      return "CityHelp";
  }
};

const statusText = (status) => {
  switch (status) {
    case "new":
      return "Новое";
    case "moderation":
      return "На модерации";
    case "processing":
      return "В работе";
    case "needs_revision":
      return "Нужна доработка";
    case "completed":
      return "Завершено";
    case "rated":
      return "Оценено";
    case "rejected":
      return "Отклонено";
    default:
      return status || "—";
  }
};

const decisionReasons = computed(() => {
  const decision = props.appeal?.aiResult?.decision || {};
  return [
    { key: "category", label: "Категория", value: decision.categoryReason || "—" },
    { key: "priority", label: "Приоритет", value: decision.priorityReason || "—" },
    { key: "deadline", label: "Дедлайн", value: decision.deadlineReason || "—" },
    { key: "status", label: "Статус", value: decision.statusReason || "—" },
    {
      key: "employee",
      label: "Сотрудник",
      value: decision.assignedEmployeeReason || "—",
    },
    { key: "location", label: "Локация", value: decision.locationReason || "—" },
  ].filter((item) => String(item.value || "").trim() && item.value !== "—");
});

const formatConfidence = (value) => Math.round(Number(value || 0) * 100);

const confidenceLevel = (value) => {
  const score = Number(value || 0);
  if (score >= 0.8) return "high";
  if (score >= 0.5) return "medium";
  return "low";
};

const confidenceItems = computed(() => {
  const aiResult = props.appeal?.aiResult || {};
  return [
    { key: "category", label: "Категория", raw: aiResult.confidenceCategory },
    { key: "priority", label: "Приоритет", raw: aiResult.confidencePriority },
    { key: "photo", label: "Фото", raw: aiResult.confidencePhoto },
  ]
    .filter((item) => item.raw !== undefined && item.raw !== null && item.raw !== "")
    .map((item) => ({
      ...item,
      value: formatConfidence(item.raw),
      level: confidenceLevel(item.raw),
    }));
});

const candidateCategories = computed(() => props.appeal?.aiResult?.candidateCategories || []);

const formatMeta = (meta = {}) => {
  const entries = [];
  if (meta.category) entries.push({ key: "category", label: "Категория", value: meta.category });
  if (meta.priority) entries.push({ key: "priority", label: "Приоритет", value: meta.priority });
  if (meta.deadlineAt) entries.push({ key: "deadlineAt", label: "Дедлайн", value: formatDateTimeToDots(meta.deadlineAt) || meta.deadlineAt });
  else if (meta.deadlineDate) entries.push({ key: "deadlineDate", label: "Дедлайн", value: meta.deadlineDate });
  if (meta.assignedEmployee?.name) {
    entries.push({
      key: "assignedEmployee",
      label: "Сотрудник",
      value: meta.assignedEmployee.name,
    });
  }
  if (meta.note) entries.push({ key: "note", label: "Комментарий", value: meta.note });
  if (meta.decision) entries.push({ key: "decision", label: "Решение", value: meta.decision });
  if (meta.score) entries.push({ key: "score", label: "Оценка", value: meta.score });
  if (meta.fixedImagesCount !== undefined) {
    entries.push({
      key: "fixedImagesCount",
      label: "Фото результата",
      value: String(meta.fixedImagesCount),
    });
  }
  if (meta.hasFixedLocation !== undefined) {
    entries.push({
      key: "hasFixedLocation",
      label: "Новая локация",
      value: meta.hasFixedLocation ? "Да" : "Нет",
    });
  }
  return entries;
};

const formatDateTime = (value) => {
  if (!value) return "—";
  return formatDateTimeToDots(value) || formatDateToDots(value) || "—";
};
</script>

<style lang="scss" scoped>
.answer {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }
  &__box {
    display: flex;
    flex-direction: column;
    gap: $gap-sm;
    background-color: $surface-100;
    padding: $padding-md;
    border-radius: $border-r-md;
  }
  &__baige {
    background-color: $secondary-accent;
    color: $white;
    padding: 4px $padding-xs;
    border-radius: $border-r-md;
  }
  &__role {
    font-weight: 500;
  }
  &__top {
    display: flex;
    justify-content: space-between;
    gap: $gap-md;
    align-items: center;
  }
  &__comment {
    line-height: 120%;
    color: $surface-600;
  }
  &__vision {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: $padding-sm;
    border-radius: $border-r-md;
    background-color: $surface-150;
  }
  &__vision-title {
    font-size: 12px;
    font-weight: 600;
    color: $surface-500;
  }
  &__vision-text {
    line-height: 130%;
    color: $surface-600;
  }
  &__reasons {
    display: flex;
    flex-direction: column;
    gap: $gap-sm;
  }
  &__list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-left: 18px;
    list-style: disc;
  }
  &__list-item {
    line-height: 1.45;
    color: $surface-600;
  }
  &__confidence-list,
  &__candidate-list {
    display: flex;
    flex-wrap: wrap;
    gap: $gap-xs;
  }
  &__confidence,
  &__candidate {
    padding: 6px $padding-xs;
    border-radius: $border-r-sm;
    font-size: 12px;
    font-weight: 600;
    background-color: $surface-100;
    color: $surface-600;
  }
  &__confidence--high {
    background-color: $status-completed-bg;
    color: $status-completed-color;
  }
  &__confidence--medium {
    background-color: $status-processing-bg;
    color: $status-processing-color;
  }
  &__confidence--low {
    background-color: $status-rejected-bg;
    color: $status-rejected-color;
  }
  &__reason {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: $padding-sm;
    border-radius: $border-r-sm;
    background-color: $surface-100;
  }
  &__reason-label {
    font-size: 12px;
    color: $surface-500;
  }
  &__reason-value {
    line-height: 130%;
    color: $surface-600;
  }
  &__timeline {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
    padding-top: $padding-md;
    border-top: 1px solid $surface-200;
  }
  &__timeline-title {
    font-weight: 700;
  }
  &__steps {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }
  &__step {
    display: flex;
    flex-direction: column;
    gap: $gap-sm;
    padding: $padding-md;
    border-radius: $border-r-md;
    background-color: $surface-100;
  }
  &__step-head {
    display: flex;
    justify-content: space-between;
    gap: $gap-md;
    align-items: flex-start;
  }
  &__step-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  &__step-title {
    font-weight: 700;
  }
  &__step-author,
  &__step-date {
    font-size: 12px;
    color: $surface-500;
  }
  &__step-text {
    line-height: 130%;
    color: $surface-600;
  }
  &__step-status {
    display: flex;
    align-items: center;
    gap: $gap-sm;
    font-size: 12px;
    color: $surface-500;
  }
  &__step-meta-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  &__step-meta-item {
    font-size: 13px;
    line-height: 130%;
  }
  &__step-meta-key {
    color: $surface-500;
  }
  &__step-meta-value {
    color: $surface-600;
  }
  &__empty {
    border-radius: $border-r-md;
    background-color: $surface-100;
    padding: $padding-md;
    color: $surface-500;
  }
  &__date {
    color: $surface-300;
    font-size: 12px;
  }
}
</style>
