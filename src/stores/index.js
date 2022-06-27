import { defineStore } from 'pinia';
import { fetchLocations, fetchPharmacies } from '../utils/http';

export const useStore = defineStore({
  id: 'main',
  state: () => ({
    // 當前所選取的城市, 預設值為臺北市
    currCity: '臺北市',
    // 當前所選行政區, 預設值為北投區
    currDistrict: '北投區',
    // 存放 API 回傳的縣市 / 行政區的列表資訊
    location: [],
    // 存放 API 回傳的所有藥局資訊
    stores: [],
    // 搜尋關鍵字
    keywords: '',
    // 控制 Modal 顯示與否
    showModal: false,
    // 當前 Modal 框內顯示藥局的 ID
    infoBoxSid: null,
  }),
  getters: {
    cityList() {
      return this.location.map((d) => d.name);
    },
    districtList() {
      return (
        this.location.find((d) => d.name === this.currCity)?.districts || []
      );
    },
    filteredStores() {
      // 依縣市、行政區分組並加入關鍵字判斷功能
      return this.keywords
        ? this.stores.filter((d) => d.name.includes(this.keywords))
        : this.stores.filter(
            (d) => d.county === this.currCity && d.town === this.currDistrict
          );
    },
    // 目前所選行政區資訊
    currDistrictInfo() {
      return this.districtList.find((d) => d.name === this.currDistrict) || {};
    },
  },
  actions: {
    async getLocations() {
      const data = await fetchLocations();
      this.location = data;
    },
    async getPharmacies() {
      const res = await fetchPharmacies();

      // 整理資料格式, 拆出經緯度
      const data = res.features.map((d) => {
        return {
          ...d.properties,
          latitude: d.geometry.coordinates[0],
          longitude: d.geometry.coordinates[1],
        };
      });
      this.stores = data;
    },
  },
});
