<template>
  <section class="categories">
    <div class="categories__wrapper">
      <div class="categories__head">
        <div>
          <h2 class="title-md">Категории обращений</h2>
          <p class="categories__sub">Категории и подкатегории для AI и модерации</p>
        </div>
      </div>

      <ThePanelAdminCategoriesForm
        v-model="form"
        :is-editing="Boolean(selectedCategoryId)"
        @reset="resetForm"
        @remove="removeCategory(selectedCategoryId)"
        @save="saveCategory"
      />

      <ThePanelAdminCategoriesList
        :items="filteredCategories"
        :search="search"
        @select="editCategory"
        @update:search="search = $event"
      />
    </div>
  </section>
</template>

<script setup>
const api = useApi();
useSeo({ title: "Категории" });

const categories = ref([]);
const search = ref("");
const selectedCategoryId = ref(null);
const form = ref({
  key: "",
  name: "",
  description: "",
  subcategories: "",
  order: 1,
  isActive: true,
});

const filteredCategories = computed(() => {
  const query = search.value.trim().toLowerCase();
  if (!query) return categories.value;
  return categories.value.filter((item) =>
    [item.name, item.description, item.key, ...(item.subcategories || [])]
      .join(" ")
      .toLowerCase()
      .includes(query),
  );
});

const normalizeCategory = (item) => ({
  id: item.id,
  key: item.key || "",
  name: item.name || "",
  description: item.description || "",
  subcategories: Array.isArray(item.subcategories) ? item.subcategories : [],
  order: item.order || 0,
  isActive: Boolean(item.isActive),
});

const loadCategories = async () => {
  const response = await api.client({
    url: "/admin/categories",
    method: "get",
  });
  categories.value = (response?.data || response || []).map(normalizeCategory);
};

const resetForm = () => {
  selectedCategoryId.value = null;
  form.value = {
    key: "",
    name: "",
    description: "",
    subcategories: "",
    order: categories.value.length + 1,
    isActive: true,
  };
};

const editCategory = (category) => {
  selectedCategoryId.value = category.id;
  form.value = {
    key: category.key,
    name: category.name,
    description: category.description,
    subcategories: category.subcategories.join(", "),
    order: category.order,
    isActive: category.isActive,
  };
};

const saveCategory = async () => {
  const payload = {
    ...form.value,
    order: Number(form.value.order || 0),
    isActive: Boolean(form.value.isActive),
  };
  const response = await api.client({
    url: selectedCategoryId.value
      ? `/admin/categories/${selectedCategoryId.value}`
      : "/admin/categories",
    method: selectedCategoryId.value ? "patch" : "post",
    body: payload,
  });
  const saved = normalizeCategory(response?.data || response || {});
  if (selectedCategoryId.value) {
    categories.value = categories.value.map((item) => (item.id === selectedCategoryId.value ? saved : item));
  } else {
    categories.value.unshift(saved);
  }
  resetForm();
};

const removeCategory = async (id) => {
  if (!id) return;
  await api.client({
    url: `/admin/categories/${id}`,
    method: "delete",
  });
  categories.value = categories.value.filter((item) => item.id !== id);
  resetForm();
};

await loadCategories();
resetForm();
</script>

<style lang="scss" scoped>
.categories {
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
