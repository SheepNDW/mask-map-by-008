/**
 * 取得行政區資料
 * @returns Promise
 */
export const fetchLocations = async () => {
  const res = await fetch(
    'https://raw.githubusercontent.com/kurotanshi/mask-map/master/raw/area-location.json'
  );
  return res.json();
};

/**
 * 取得藥局資料
 * @returns Promise
 */
export const fetchPharmacies = async () => {
  const res = await fetch(
    'https://kiang.github.io/pharmacies/json/points.json'
  );
  return res.json();
};
