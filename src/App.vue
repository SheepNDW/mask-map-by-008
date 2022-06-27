<script setup>
import { ref } from 'vue';
import asideMenu from './components/asideMenu.vue';
import lightbox from './components/lightbox.vue';
import maskMap from './components/maskMap.vue';
import { useStore } from './stores/index';

const store = useStore();
store.getLocations();
store.getPharmacies();

const mapRef = ref(null);
const openPopup = (id) => {
  mapRef.value.triggerPopup(id);
};
</script>

<template>
  <div id="app">
    <!-- aside-menu 左側欄 -->
    <asideMenu @trigger-marker-popup="openPopup" />

    <!-- 地圖區塊 -->
    <maskMap ref="mapRef" />

    <lightbox />
  </div>
</template>

<style lang="scss" src="./style.scss"></style>
