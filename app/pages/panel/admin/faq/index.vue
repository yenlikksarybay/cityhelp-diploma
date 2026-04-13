<template>
  <section class="faq-admin">
    <div class="faq-admin__wrapper">
      <div class="faq-admin__head">
        <div>
          <h2 class="title-md hidden">FAQ</h2>
          <p class="faq-admin__sub">Управление вопросами и ответами</p>
        </div>
      </div>

      <ThePanelAdminFaqForm
        :form="form"
        :is-editing="Boolean(selectedFaqId)"
        @reset="resetForm"
        @remove="removeFaq(selectedFaqId)"
        @save="saveFaq"
        @update:field="updateField"
      />

      <ThePanelAdminFaqList
        :items="filteredFaqs"
        :search="search"
        @select="editFaq"
        @update:search="search = $event"
      />
    </div>
  </section>
</template>

<script setup>
const api = useApi();
useSeo({ title: "FAQ" });

const faqs = ref([]);
const search = ref("");
const selectedFaqId = ref(null);
const form = ref({
  key: "",
  question: "",
  answer: "",
  category: "Общие вопросы",
  order: 1,
  isActive: true,
});

const filteredFaqs = computed(() => {
  const query = search.value.trim().toLowerCase();
  if (!query) return faqs.value;
  return faqs.value.filter((item) =>
    [item.question, item.answer, item.category, item.key]
      .join(" ")
      .toLowerCase()
      .includes(query),
  );
});

const loadFaq = async () => {
  const response = await useFetchSsr({
    url: "/admin/faq",
    method: "get",
  });
  faqs.value = (response?.data || response || []).map((item) => ({
    id: String(item.id || item._id || ""),
    key: item.key,
    question: item.question,
    answer: item.answer,
    category: item.category,
    order: item.order || 0,
    isActive: Boolean(item.isActive),
  }));
};

const resetForm = () => {
  selectedFaqId.value = null;
  form.value = {
    key: "",
    question: "",
    answer: "",
    category: "Общие вопросы",
    order: faqs.value.length + 1,
    isActive: true,
  };
};

const editFaq = (faq) => {
  selectedFaqId.value = faq.id;
  form.value = {
    key: faq.key,
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    order: faq.order,
    isActive: faq.isActive,
  };
};

const updateField = (field, value) => {
  form.value[field] = value;
};

const saveFaq = async () => {
  const payload = {
    ...form.value,
    order: Number(form.value.order || 0),
    isActive: Boolean(form.value.isActive),
  };
  const response = await api.client({
    url: selectedFaqId.value
      ? `/admin/faq/${selectedFaqId.value}`
      : "/admin/faq",
    method: selectedFaqId.value ? "patch" : "post",
    body: payload,
  });
  const saved = response?.data || response || {};
  if (selectedFaqId.value) {
    faqs.value = faqs.value.map((item) =>
      item.id === selectedFaqId.value ? { ...item, ...saved } : item,
    );
  } else {
    faqs.value.unshift(saved);
  }
  resetForm();
};

const removeFaq = async (id) => {
  if (!id) return;
  await api.client({
    url: `/admin/faq/${id}`,
    method: "delete",
  });
  faqs.value = faqs.value.filter((item) => item.id !== id);
  resetForm();
};

await loadFaq();
resetForm();
</script>

<style lang="scss" scoped>
.faq-admin {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }

  &__sub {
    margin-top: 8px;
    color: $surface-500;
  }
}
</style>
