// 定义多边形悬停事件处理程序
var bindUP = function (County, SR) {
  let highlightedLayer = [];
  County.eachLayer(function (layer) {
    layer.on("mouseover", function (e) {
      //
      this.setStyle({
        fillColor: "#0000ff",
        fillOpacity: 0.3,
      });
      // console.log(highlightedLayer);
      // 获取A图层多边形的属性字段值
      var attributeValue = layer.feature.properties.COUNTYNAME; // 替换为实际的属性字段名称
      // console.log(attributeValue);
      // 在B图层中查找匹配的多边形
      SR.eachLayer(function (bLayer) {
        var bAttributeValue = bLayer.feature.properties.COUNTYNAME; // 替换为实际的属性字段名称
        if (attributeValue === bAttributeValue) {
          // 高亮显示匹配的B图层的多边形
          bLayer.setStyle({ fillOpacity: 0.5, color: "red" });
          highlightedLayer.push(bLayer);
        }
      });
    });
    //   // 移除高亮显示
    layer.on("mouseout", function (e) {
      this.setStyle({
        fillOpacity: 0,
      });
      // console.log(highlightedLayer);
      highlightedLayer.map((feture) => {
        feture.setStyle({ fillOpacity: 1, color: "black" });
      });
      highlightedLayer = [];
    });
  });
};

//       });
//     // })})
// })
export default bindUP;
