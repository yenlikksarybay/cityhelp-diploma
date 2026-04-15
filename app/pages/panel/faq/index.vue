<template>
  <section class="faq">
    <div class="faq__wrapper">
      <div class="faq__head">
        <div>
          <!-- <h2 class="title-md">FAQ</h2> -->
          <p class="faq__sub">
            Ответы на частые вопросы по обращениями, статусам и оценке
          </p>
        </div>
      </div>

      <UiAccordion :items="accordionItems" v-model="openFaq" />
    </div>
  </section>
</template>

<script setup>
useSeo({ title: "FAQ" });

const faqs = ref([]);
const openFaq = ref(null);

const accordionItems = computed(() =>
  faqs.value.reduce((acc, item) => {
    acc[item.id] = {
      id: item.id,
      title: item.question,
      meta: item.category,
      content: item.answer,
    };
    return acc;
  }, {}),
);

const loadFaq = async () => {
  const response = await useFetchSsr({
    url: "/faq",
    method: "get",
  });
  faqs.value = (response?.data || response || []).map((item) => ({
    id: String(item.id || item._id || ""),
    question: item.question,
    answer: item.answer,
    category: item.category,
  }));
  openFaq.value = faqs.value[0]?.id || null;
};

await loadFaq();
</script>

<style lang="scss" scoped>
.faq {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xl;
  }

  &__sub {
    margin-top: 8px;
    color: $surface-500;
  }
}
</style>
