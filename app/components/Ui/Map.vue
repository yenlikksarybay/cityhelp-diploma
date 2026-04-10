<template>
  <div class="map">
    <div ref="mapContainer" class="map__wrapper"></div>

    <div class="map__meta">
      <p class="map__title">
        {{
          selectable
            ? "Нажмите на карту, чтобы выбрать место"
            : "Точка на карте"
        }}
      </p>

      <p v-if="currentPoint" class="map__coords">
        <span><b>x:</b> {{ currentPoint.x }}</span>
        <span><b>y:</b> {{ currentPoint.y }}</span>
      </p>

      <p v-if="currentAddress" class="map__address">
        <b>Адрес:</b> {{ currentAddress }}
      </p>
      <p v-else-if="currentPoint" class="map__empty">Адрес определяется...</p>
      <p v-else class="map__empty">Точка не выбрана</p>

      <div v-if="selectable && currentPoint" class="map__actions">
        <button class="map__clear" type="button" @click="clearPoint">
          Сбросить точку
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
  x: {
    type: Number,
    default: null,
  },
  y: {
    type: Number,
    default: null,
  },
  center: {
    type: Array,
    default: () => [43.238949, 76.889709],
  },
  zoom: {
    type: Number,
    default: 15,
  },
  markerText: {
    type: String,
    default: "Выбранная точка",
  },
  selectable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const mapContainer = ref(null);
const mapInstance = shallowRef(null);
const placemarkInstance = shallowRef(null);
const currentPoint = ref(null);
const currentAddress = ref("");

let clickHandler = null;
let geocodeRequestId = 0;

const normalizePoint = (value) => {
  if (Array.isArray(value) && value.length >= 2) {
    const x = Number(value[0]);
    const y = Number(value[1]);

    if (Number.isFinite(x) && Number.isFinite(y)) {
      return { x, y };
    }
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const x = Number(value.x ?? value.lat ?? value.latitude);
  const y = Number(value.y ?? value.lng ?? value.lon ?? value.longitude);

  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }

  return { x, y };
};

const pointToCoords = (point) => [point.x, point.y];

const normalizeAddress = (value) => String(value || "").trim();

const buildAddressText = (geoObject) => {
  if (!geoObject?.properties?.get) {
    return "";
  }

  const text = normalizeAddress(geoObject.properties.get("text"));
  const name = normalizeAddress(geoObject.properties.get("name"));
  const description = normalizeAddress(geoObject.properties.get("description"));

  return text || [description, name].filter(Boolean).join(", ") || name || description;
};

const emitPoint = (point, address = currentAddress.value) => {
  if (!point) {
    emit("update:modelValue", null);
    return;
  }

  const normalizedAddress = normalizeAddress(address);

  emit("update:modelValue", {
    x: point.x,
    y: point.y,
    address: normalizedAddress,
    label: normalizedAddress,
  });
};

const getPointFromProps = () => {
  return (
    normalizePoint(props.modelValue) ||
    normalizePoint({ x: props.x, y: props.y })
  );
};

const removePlacemark = () => {
  if (mapInstance.value && placemarkInstance.value) {
    mapInstance.value.geoObjects.remove(placemarkInstance.value);
    placemarkInstance.value = null;
  }
};

const syncPlacemark = (point) => {
  if (!mapInstance.value || typeof ymaps === "undefined") {
    return;
  }

  if (!point) {
    removePlacemark();
    return;
  }

  const coords = pointToCoords(point);

  if (!placemarkInstance.value) {
    placemarkInstance.value = new ymaps.Placemark(
      coords,
      {
        balloonContent: props.markerText,
      },
      {
        preset: "islands#icon",
        iconColor: "#0095b6",
      },
    );

    mapInstance.value.geoObjects.add(placemarkInstance.value);
    return;
  }

  placemarkInstance.value.geometry.setCoordinates(coords);
  placemarkInstance.value.properties.set("balloonContent", props.markerText);
};

const syncFromProps = ({ centerMap = false } = {}) => {
  const point = getPointFromProps();
  currentPoint.value = point;
  currentAddress.value = normalizeAddress(
    props.modelValue?.label || props.modelValue?.address || "",
  );

  if (!mapInstance.value) {
    return;
  }

  syncPlacemark(point);

  if (centerMap && point) {
    mapInstance.value.setCenter(pointToCoords(point));
  }
};

const clearPoint = () => {
  geocodeRequestId += 1;
  currentPoint.value = null;
  currentAddress.value = "";
  removePlacemark();
  emit("update:modelValue", null);
};

const resolveAddressForPoint = async (point) => {
  if (!point || typeof ymaps === "undefined" || typeof ymaps.geocode !== "function") {
    return "";
  }

  const requestId = ++geocodeRequestId;
  const coords = pointToCoords(point);

  const kinds = ["house", "street"];

  for (const kind of kinds) {
    try {
      const result = await ymaps.geocode(coords, { kind, results: 1 });

      if (requestId !== geocodeRequestId) {
        return "";
      }

      const geoObject = result?.geoObjects?.get?.(0);
      const address = buildAddressText(geoObject);

      if (address) {
        return address;
      }
    } catch {
      // Ignore geocoder errors and keep trying the fallback kind.
    }
  }

  return "";
};

const initMap = () => {
  if (
    !mapContainer.value ||
    mapInstance.value ||
    typeof ymaps === "undefined"
  ) {
    return;
  }

  mapInstance.value = new ymaps.Map(mapContainer.value, {
    center: props.center,
    zoom: props.zoom,
    controls: [],
  });

  syncFromProps({ centerMap: true });

  if (props.selectable) {
    clickHandler = (event) => {
      const coords = event.get("coords");

      if (!Array.isArray(coords) || coords.length < 2) {
        return;
      }

      const point = {
        x: Number(coords[0]),
        y: Number(coords[1]),
      };

      currentPoint.value = point;
      syncPlacemark(point);
      emitPoint(point);

      resolveAddressForPoint(point).then((address) => {
        if (!address || !currentPoint.value) {
          return;
        }

        currentAddress.value = address;
        emitPoint(point, address);
      });
    };

    mapInstance.value.events.add("click", clickHandler);
  }
};

onMounted(async () => {
  await nextTick();

  if (typeof ymaps === "undefined") {
    console.error("Yandex Maps API is not loaded.");
    return;
  }

  ymaps.ready(initMap);
});

watch(
  () => props.modelValue,
  () => {
    syncFromProps();
  },
  { deep: true },
);

watch(
  () => [props.x, props.y],
  () => {
    syncFromProps();
  },
);

watch(
  () => props.markerText,
  () => {
    if (currentPoint.value) {
      syncPlacemark(currentPoint.value);
    }
  },
);

watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      currentAddress.value = "";
      return;
    }

    currentAddress.value = normalizeAddress(value.label || value.address || "");
  },
  { deep: true },
);

onBeforeUnmount(() => {
  if (mapInstance.value && clickHandler) {
    mapInstance.value.events.remove("click", clickHandler);
  }

  removePlacemark();

  if (mapInstance.value && typeof mapInstance.value.destroy === "function") {
    mapInstance.value.destroy();
    mapInstance.value = null;
  }
});
</script>

<style scoped lang="scss">
.map {
  width: 100%;

  &__wrapper {
    width: 100%;
    height: 500px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: $box-shadow-md;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 12px;
    padding: 12px 14px;
    border-radius: 12px;
    background: rgba($secondary-accent, 0.08);
    border: 1px solid rgba($secondary-accent, 0.2);
    min-height: 72px;
  }

  &__title {
    font-size: 13px;
    font-weight: 700;
    color: $surface-500;
  }

  &__coords {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    font-size: 14px;
    color: $surface-500;
  }

  &__address {
    font-size: 14px;
    color: $surface-500;
  }

  &__empty {
    font-size: 14px;
    color: $surface-500;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }

  &__clear {
    border: 0;
    background: transparent;
    color: $secondary-accent;
    font-weight: 700;
    cursor: pointer;
    padding: 0;
  }
}
</style>
