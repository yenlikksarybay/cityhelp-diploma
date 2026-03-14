<script setup>
const file = ref(null);
const uploaded = ref(null);
const files = ref([]);
const loading = ref(false);
const error = ref("");

const onChange = (event) => {
  file.value = event.target.files?.[0] || null;
};

const uploadFile = async () => {
  if (!file.value) return;

  loading.value = true;
  error.value = "";

  try {
    const formData = new FormData();
    formData.append("file", file.value);

    const response = await $fetch("/api/blob/upload", {
      method: "POST",
      body: formData,
    });

    uploaded.value = response.data;
    await loadFiles();
  } catch (err) {
    error.value = err?.data?.statusMessage || err.message || "Upload error";
  } finally {
    loading.value = false;
  }
};

const loadFiles = async () => {
  try {
    const response = await $fetch("/api/blob/list");
    files.value = response.data || [];
  } catch (err) {
    error.value = err?.data?.statusMessage || err.message || "List error";
  }
};
</script>

<template>
  <div style="padding: 24px">
    <input type="file" accept="image/*" @change="onChange" />
    <button @click="uploadFile" :disabled="loading">
      {{ loading ? "Загрузка..." : "Загрузить" }}
    </button>

    <p v-if="error">{{ error }}</p>

    <div v-if="uploaded">
      <p>{{ uploaded.url }}</p>
      <img :src="uploaded.url" alt="" style="max-width: 300px" />
    </div>

    <button @click="loadFiles">Обновить список</button>

    <div v-for="item in files" :key="item.url" style="margin-top: 16px">
      <p>{{ item.pathname }}</p>
      <img :src="item.url" alt="" style="max-width: 200px" />
    </div>
  </div>
</template>
