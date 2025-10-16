<template>
  <div id="container"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { mapListApi } from "@/api/map";
import icon from "@/assets/flashIcon.png";
import station from "@/assets/station.jpg";

interface Props {
  refreshToken?: number;
}
const props = defineProps<Props>();

let map: any = null;
let AMapLib: any = null;
const markers: any[] = [];

// 加载并渲染标注的函数，可被外部触发
async function loadMarkers() {
  if (!map) return;
  // 清理旧标注
  while (markers.length) {
    const m = markers.pop();
    try {
      m.setMap && m.setMap(null);
    } catch (e) {
      /* ignore */
    }
  }

  try {
    const { data } = await mapListApi();
    console.log("地图数据", data);

    data.forEach((item: any) => {
      const marker = new AMapLib.Marker({
        position: item.position,
        title: item.title,
        icon: icon,
      });
      marker.on("click", () => {
        const infoWindow = new AMapLib.InfoWindow({
          content: `<div style="display:flex;padding:10px;align-items:center">
                <div><img src="${station}" width="200px"/></div>
                <div style="width:180px;line-height:30px;margin-left:20px">
                    <h3>${item.title}</h3>
                    <p>充电桩数量：${item.count}</p>
                    <p>充电站状态：<span style="color:blue">${
                      item.status == 1 ? "使用中" : "维护中"
                    }</span></p>
                </div>
              </div>`,
          offset: new AMapLib.Pixel(0, -30),
        });
        infoWindow.open(map, marker.getPosition());
      });
      marker.setMap(map);
      markers.push(marker);
    });
  } catch (err) {
    console.error("loadMarkers error", err);
  }
}

onMounted(() => {
  AMapLoader.load({
    key: "c4b0f8db6005f25720d601159b3699cc",
    version: "1.4.15",
    plugins: [],
  })
    .then((AMap) => {
      AMapLib = AMap;
      map = new AMap.Map("container", {
        viewMode: "3D",
        zoom: 6,
      });
      // 显式设置中心，确保生效
      try {
        map.setZoomAndCenter(6, [116.397428, 39.90923]);
      } catch (e) {
        try {
          map.setZoom(6);
          map.setCenter([116.397428, 39.90923]);
        } catch (e) {}
      }
      // 首次加载标注
      loadMarkers();
      // 触发一次 resize
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 50);
    })
    .catch((e) => {
      console.error(e);
    });
});

// 当 refreshToken 改变时重新加载标注
watch(
  () => props.refreshToken,
  (v, ov) => {
    console.log("refreshToken changed", v, ov);

    if (v !== ov) {
      loadMarkers();
    }
  }
);

onUnmounted(() => {
  try {
    markers.forEach((m) => m.setMap && m.setMap(null));
  } catch (e) {}
  map?.destroy();
});
</script>

<style scoped lang="scss">
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 80vh;
}
</style>
