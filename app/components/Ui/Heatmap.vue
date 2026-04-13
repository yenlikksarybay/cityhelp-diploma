<template>
  <div class="heatmap">
    <div ref="mapContainer" class="heatmap__wrapper"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  points: {
    type: Array,
    default: () => [],
  },
  center: {
    type: Array,
    default: () => [43.238949, 76.889709],
  },
  zoom: {
    type: Number,
    default: 12,
  },
});

const mapContainer = ref(null);
const mapInstance = shallowRef(null);
const heatmapInstance = shallowRef(null);

const defaultPoints = [];

const resolvedPoints = computed(() =>
  props.points.length ? props.points : defaultPoints,
);

const destroyMap = () => {
  if (heatmapInstance.value) {
    heatmapInstance.value.setMap(null);
    heatmapInstance.value = null;
  }

  if (mapInstance.value) {
    mapInstance.value.destroy();
    mapInstance.value = null;
  }
};

const renderHeatmap = (Heatmap) => {
  if (!mapContainer.value) {
    return;
  }

  destroyMap();

  mapInstance.value = new ymaps.Map(mapContainer.value, {
    center: props.center,
    zoom: props.zoom,
    controls: ["zoomControl"],
  });

  heatmapInstance.value = new Heatmap(resolvedPoints.value);
  heatmapInstance.value.options.set({
    radius: 28,
    opacity: 0.85,
    intensityOfMidpoint: 0.25,
    dissipating: false,
    gradient: {
      0.1: "rgba(103, 210, 255, 0.75)",
      0.35: "rgba(0, 159, 122, 0.8)",
      0.6: "rgba(255, 196, 61, 0.9)",
      0.85: "rgba(255, 115, 0, 0.95)",
      1.0: "rgba(214, 45, 32, 1)",
    },
  });
  heatmapInstance.value.setMap(mapInstance.value);
};

const initHeatmap = () => {
  if (typeof ymaps === "undefined") {
    console.error("Yandex Maps API is not loaded.");
    return;
  }

  ymaps.ready(() => {
    ymaps.modules.require(["Heatmap"], (Heatmap) => {
      renderHeatmap(Heatmap);
    });
  });
};

onMounted(() => {
  initHeatmap();
});

watch(
  () => [props.points, props.center, props.zoom],
  () => {
    if (!mapInstance.value || typeof ymaps === "undefined") {
      return;
    }

    ymaps.modules.require(["Heatmap"], (Heatmap) => {
      renderHeatmap(Heatmap);
    });
  },
  { deep: true },
);

onBeforeUnmount(() => {
  destroyMap();
});
</script>

<style scoped lang="scss">
.heatmap {
  width: 100%;

  &__wrapper {
    width: 100%;
    height: 500px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: $box-shadow-md;
  }
}
</style>
