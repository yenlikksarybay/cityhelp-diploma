<template>
  <div class="map">
    <div ref="mapContainer" class="map__wrapper"></div>
  </div>
</template>

<script setup>
const mapContainer = ref(null);

onMounted(() => {
  if (typeof ymaps !== "undefined") {
    ymaps.ready(() => {
      const map = new ymaps.Map(mapContainer.value, {
        center: [43.238949, 76.889709],
        zoom: 15,
        controls: [],
      });
      const placemark = new ymaps.Placemark(
        [55.751574, 37.573856],
        {
          balloonContent: "This is Almaty!",
        },
        {
          preset: "islands#icon",
          iconColor: "#0095b6",
        },
      );

      map.geoObjects.add(placemark);
    });
  } else {
    console.error("Yandex Maps API is not loaded.");
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
}
</style>
