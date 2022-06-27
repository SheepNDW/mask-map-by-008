<script setup>
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { useStore } from '../stores';

const store = useStore();
const { cityList, filteredStores } = storeToRefs(store);

const currCity = computed({
  get: () => store.currCity,
  set: (val) => (store.currCity = val),
});

const currDistrict = computed({
  get: () => store.currDistrict,
  set: (val) => (store.currDistrict = val),
});

const keywords = computed({
  get: () => store.keywords,
  set: (val) => (store.keywords = val),
});

const districtList = computed(() => {
  return store.districtList;
});

watch(districtList, (val) => {
  // 解構出第一個行政區並預設它為初始值
  const [arr] = val;
  currDistrict.value = arr.name;
});

// 關鍵字搜尋高亮效果
const keywordHighlight = (val) => {
  return val.replace(
    new RegExp(keywords.value, 'g'),
    `<span class="highlight">${keywords.value}</span>`
  );
};

// Modal 相關邏輯
const showModal = computed({
  get: () => store.showModal,
  set: (val) => (store.showModal = val),
});
const infoBoxSid = computed({
  get: () => store.infoBoxSid,
  set: (val) => (store.infoBoxSid = val),
});
const openInfoBox = (storeId) => {
  showModal.value = true;
  infoBoxSid.value = storeId;
};
</script>

<template>
  <div class="aside-menu">
    <div class="wraps">
      <label>
        縣市：<select v-model="currCity">
          <option v-for="city in cityList" :key="city">
            {{ city }}
          </option>
        </select>
      </label>
      <label>
        行政區：<select v-model="currDistrict">
          <option v-for="district in districtList" :key="district.id">
            {{ district.name }}
          </option>
        </select>
      </label>
    </div>

    <div class="wraps">
      <label>
        <i class="fas fa-search-location"></i> 關鍵字搜尋：
        <input type="text" placeholder="請輸入關鍵字" v-model="keywords" />
      </label>
    </div>

    <ul class="store-lists">
      <li
        class="store-info wraps"
        v-for="store in filteredStores"
        :key="store.id"
        @click="$emit('triggerMarkerPopup', store.id)"
      >
        <h1 v-html="keywordHighlight(store.name)"></h1>

        <div class="mask-info">
          <i class="fas fa-head-side-mask"></i>
          <span>大人口罩: {{ store.mask_adult }} 個</span>
        </div>

        <div class="mask-info">
          <i class="fas fa-baby"></i>
          <span>兒童口罩: {{ store.mask_child }} 個</span>
        </div>

        <div class="mask-info">最後更新時間: {{ store.updated }}</div>

        <button class="btn-store-detail" @click="openInfoBox(store.id)">
          <i class="fas fa-info-circle"></i>
          看詳細資訊
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
:deep(.highlight) {
  color: #f08d49;
}
</style>
