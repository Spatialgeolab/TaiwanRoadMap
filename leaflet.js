import bindUP from "./hightlightroad.js";
import countyList from "./constant.js";
//創造leaflet地圖
var map = L.map("map", { renderer: L.canvas() }).setView(
  [23.828554176435247, 120.96561211422615],
  7
);

var roadData;
let roadStyle = {
  color: "black",
  weight: 3,
};
let SR;
let County;

//添加OSM底圖
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 14,
}).addTo(map);
//加載縣市邊界
fetch("./COUNTY.geojson")
  .then(function (response) {
    return response.json();
  })
  .then(function (myJson) {
    County = L.geoJSON(myJson, {}).addTo(map);
    County.setStyle({ fillColor: "#0000ff", fillOpacity: 0, weight: 1.2 });
  });
// 初始化道路
fetch("./road_data.geojson")
  .then(function (response) {
    return response.json();
  })
  .then(function (myJson) {
    roadData = myJson;
    SR = L.geoJSON(roadData, {
      onEachFeature: function (feature, layer) {
        // 對每個feature添加Popup
        layer.bindTooltip(
          "<h2>" +
            feature.properties.name +
            "</h2><p>行政區: " +
            feature.properties.COUNTYNAME +
            feature.properties.TOWNNAME +
            "</p>"
        );
      },
    }).addTo(map);
    bindUP(County, SR);
    SR.setStyle(roadStyle);
  });
// 透過option value選擇要載入的道路
let selectedRoadLoad = (road) => {
  console.log(roadData);
  SR = L.geoJSON(roadData, {
    filter: (feature) => {
      if (road == "All") {
        return true;
      }
      return feature.properties.name.includes(road);
    },
    onEachFeature: function (feature, layer) {
      layer.bindTooltip(
        "<h2>" +
          feature.properties.name +
          "</h2><p>行政區: " +
          feature.properties.COUNTYNAME +
          feature.properties.TOWNNAME +
          "</p>"
      );
    },
  }).addTo(map);
  SR.setStyle(roadStyle);
  bindUP(County, SR);
  return SR;
};
//更新統計道路數量
let updataLegend = (selectedData) => {
  //   console.log(selectedData);
  selectedData.features.map((feature) => {
    let countyName = feature.properties.COUNTYNAME;
    if (countyList.hasOwnProperty(countyName)) {
      countyList[countyName] += 1;
    } else {
      countyList[countyName] = 1;
    }
  });
  let legend = document.getElementById("legend-table");
  let keys = Object.keys(countyList);
  let numRows = 2; // 2行
  let numColumns = 11; // 11列
  let content = "";
  for (let row = 0; row < numRows; row++) {
    content += "<tr>";
    for (let col = 0; col < numColumns; col++) {
      let index = row * numColumns + col;
      if (index < keys.length) {
        let key = keys[index];
        content += `<td class='legend-item'>${key}:&nbsp</td><td class='legend'>${countyList[key]}</td>`;
      } else {
        content += "<td></td><td></td>";
      }
    }
    content += "</tr>";
  }
  console.log(content);
  legend.innerHTML = `<table>${content}</table>`;
};

// 綁定下拉選單的監聽事件
document.getElementById("roadSelector").addEventListener("change", function () {
  map.removeLayer(SR);
  let selectedRoad = this.value;
  console.log("selectedRoad", selectedRoad);
  console.log("County:", County);
  // 載入filter後的道路
  let filterSR = selectedRoadLoad(selectedRoad);
  console.log(filterSR);
  // 重新統計filter後的SR資料
  updataLegend(filterSR.toGeoJSON());
});
