<script setup>
import L from 'leaflet';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { useStore } from '../stores';

const map = ref(null);
onMounted(() => {
  map.value = L.map('mask-map', {
    center: [25.03, 121.55],
    zoom: 14,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '<a target="_blank" href="https://www.openstreetmap.org/">© OpenStreetMap 貢獻者</a>',
    maxZoom: 18,
  }).addTo(map.value);
});

const store = useStore();
const { currDistrictInfo, filteredStores } = storeToRefs(store);

const { addMarker, clearMarkers, triggerPopup } = useMarker();

// 當使用者切換行政區時, 透過 watch 監聽並透過 Leaflet 所提供的 map.panTo() 來指定地圖中心點
watch(currDistrictInfo, (district) => {
  map.value.panTo(new L.LatLng(district.latitude, district.longitude));
});

// 根據藥局資訊加入對應 marker
watch(filteredStores, (stores) => {
  // 清除原有 marker
  clearMarkers();

  stores.forEach((element) => addMarker(element));
});

defineExpose({
  triggerPopup,
});

function useMarker() {
  const markers = ref([]);

  const addMarker = (item) => {
    // 標記的圖示
    const ICON = {
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    };

    // 將標記放置到地圖上
    const marker = L.marker([item.longitude, item.latitude], ICON)
      .addTo(map.value)
      .bindPopup(`<h2 class="popup-name">${item.name}</h2>`);

    // 替 marker 加入 id 與經緯度資訊
    marker.markerId = item.id;
    marker.lng = item.longitude;
    marker.lat = item.latitude;

    markers.value.push(marker);
  };

  const clearMarkers = () => {
    map.value.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.value.removeLayer(layer);
      }
    });

    markers.value.length = 0;
  };

  const triggerPopup = (markerId) => {
    // 找出目標標記
    const marker = markers.value.find((item) => item.markerId === markerId);

    // 將地圖中心指向目標標記, 並開啟 Popup
    map.value.flyTo(new L.LatLng(marker.lng, marker.lat), 15);
    marker.openPopup();
  };

  return {
    addMarker,
    clearMarkers,
    triggerPopup,
  };
}
</script>

<template>
  <div class="mask-map" id="mask-map"></div>
</template>

<style lang="scss" scoped></style>
