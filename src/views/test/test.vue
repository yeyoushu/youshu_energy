<template>
  <div>
    <!-- 左侧底图切换（单选） -->
    <div
      style="
        position: absolute;
        left: 274px;
        top: 272px;
        z-index: 999;
        padding: 8px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.95);
      "
    >
      <el-radio-group
        v-model="activeBasemap"
        @change="onBasemapChange"
        style="display: flex; flex-direction: column; gap: 6px"
      >
        <el-radio-button label="vec">矢量底图 + 注记</el-radio-button>
        <el-radio-button label="img">影像底图 + 注记</el-radio-button>
      </el-radio-group>
    </div>

    <div style="margin-bottom: 8px; display: flex; gap: 8px; flex-wrap: wrap">
      <el-button type="danger" @click="destroy">销毁地图</el-button>
      <el-button type="primary" @click="init">初始化地图</el-button>
      <el-button @click="resize">重绘地图</el-button>
      <el-button @click="toBeijing">定位：北京</el-button>
      <el-button @click="zoomIn">缩放到 14</el-button>
      <el-button type="success" @click="addGraphicsLayer"
        >添加示例点图层</el-button
      >
      <el-button @click="showSampleLayer">显示示例点</el-button>
      <el-button @click="hideSampleLayer">隐藏示例点</el-button>
      <el-button @click="measureAreaDemo">测面积</el-button>
      <el-button @click="measureLengthDemo">测长度</el-button>
      <el-button type="warning" @click="startRecord">开始录轨</el-button>
      <el-button type="warning" @click="stopRecord">停止录轨</el-button>
      <el-button @click="pushMockPoint">推送 mock 点</el-button>
      <el-button @click="playMockTrace">播放 mock 轨迹</el-button>
      <!-- 自动导入 AMap 点，无需手动按钮 -->
    </div>
    <arcgis-map
      ref="mapComp"
      :center="[116.397428, 39.90923]"
      :zoom="12"
      @ready="onMapReady"
      @basemap-change="onChildBasemapChange"
      @layer-list-changed="onLayerListChanged"
    />

    <!-- 图层面板（右侧） -->
    <layer-panel
      class="layer-panel"
      :layers="controlledLayers"
      @toggle="onToggleLayer"
      @remove="onRemoveLayer"
      @visibility-change="onSetLayerVisibility"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import ArcgisMap from "@/components/arcgisMap/arcgisMap.vue";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import LayerPanel from "@/components/layerPanel/LayerPanel.vue";
import { mapListApi } from "@/api/map";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import station from "@/assets/station.jpg";
import icon from "@/assets/flashIcon.png";
import useMapTools from "@/hooks/useMapTools";
import { createTrackWs, type TrackMessage } from "@/utils/trackWs";

// 简单的图层控制相关
const controlledLayers = ref<
  Array<{ id: string; title?: string; visible?: boolean }>
>([]);
/**
 * 示例：创建并添加一个包含模拟点的 GraphicsLayer 到地图
 */
const mapComp = ref<InstanceType<typeof ArcgisMap> | null>(null);

// 当前激活的底图（默认选中矢量）
const activeBasemap = ref<"vec" | "img">("vec");

function onBasemapChange(val: "vec" | "img") {
  mapComp.value?.switchBasemap(val);
}

// 当 ArcGIS 地图组件准备好时（由子组件 emit 'ready' 触发）
function onMapReady() {
  // 读取子组件的 basemap 模式以设置本地状态
  const mode = mapComp.value?.getBasemapMode?.();
  if (mode) activeBasemap.value = mode;
  // 在地图准备好后自动导入 AMap 点
  // 先从子组件主动拉取当前图层列表，确保父组件有初始数据以供 LayerPanel 渲染
  // 等待一个微任务，确保子组件完全完成内部初始化与 emit，再主动拉取一次图层列表
  nextTick(() => {
    const initial = mapComp.value?.getLayerList?.();
    console.log(initial, "initial", initial && Array.isArray(initial));
    if (initial && Array.isArray(initial)) {
      controlledLayers.value = initial;
    }
  });
  void importAMapPointsToArcGIS();
}

// 从子组件接收 basemap-change 事件并设置本地 ref
function onChildBasemapChange(m: "vec" | "img") {
  activeBasemap.value = m;
}

// 从子组件接收 layer-list-changed 事件并设置本地受控图层列表
function onLayerListChanged(
  list: Array<{ id: string; title?: string; visible?: boolean }>
) {
  controlledLayers.value = list;
}

function destroy() {
  mapComp.value?.destroyMap();
}

function init() {
  mapComp.value?.initMap();
}

function resize() {
  mapComp.value?.resizeMap();
}

function toBeijing() {
  mapComp.value?.setCenter([116.397428, 39.90923]);
}

function zoomIn() {
  mapComp.value?.setZoom(14);
}

function addGraphicsLayer() {
  // 创建点图层并添加带符号和属性的模拟点
  const glPoints = new GraphicsLayer({
    id: "sampleGraphics",
    title: "示例点图层",
  });

  const symbol = new SimpleMarkerSymbol({
    style: "circle",
    color: [226, 119, 40],
    size: "12px",
    outline: { color: [255, 255, 255], width: 1 },
  });

  const points = [
    { x: 116.397428, y: 39.90923, attrs: { name: "Point A" } },
    { x: 116.407428, y: 39.91923, attrs: { name: "Point B" } },
  ];

  for (const p of points) {
    const graphic = new Graphic({
      geometry: new Point({ x: p.x, y: p.y, spatialReference: { wkid: 4326 } }),
      symbol,
      attributes: p.attrs,
    });
    glPoints.add(graphic);
  }

  // 创建独立的区域图层并添加一个半透明的多边形区域（opacity 0.7）
  const glArea = new GraphicsLayer({
    id: "sampleArea",
    title: "示例区域图层",
  });

  const polygon = new Polygon({
    rings: [
      [
        [116.395, 39.907],
        [116.405, 39.907],
        [116.405, 39.915],
        [116.395, 39.915],
        [116.395, 39.907],
      ],
    ],
    spatialReference: { wkid: 4326 },
  });

  const fill = new SimpleFillSymbol({
    color: [255, 0, 0, 0.7],
    style: "solid",
    outline: { color: [200, 0, 0, 0.9], width: 1 },
  });

  const areaGraphic = new Graphic({
    geometry: polygon,
    symbol: fill,
    attributes: { name: "示例区域" },
  });
  glArea.add(areaGraphic);

  // 将两个图层分别添加到地图，这样图层面板会显示两个独立条目
  mapComp.value?.addLayer(glPoints);
  mapComp.value?.addLayer(glArea);
}

// ---- map tools demo ----
let tools: any = null;
function ensureTools() {
  if (!tools && mapComp.value?.getView) {
    const view = mapComp.value.getView();
    if (view) tools = useMapTools(view as any);
  }
}

async function measureAreaDemo() {
  ensureTools();
  if (!tools) return;
  try {
    const res = await tools.measureArea();
    console.log("measured area m2:", res.area, res.rings);
  } catch (e) {
    console.error(e);
  }
}

async function measureLengthDemo() {
  ensureTools();
  if (!tools) return;
  try {
    const res = await tools.measureLength();
    console.log("measured length m:", res.length, res.paths);
  } catch (e) {
    console.error(e);
  }
}

let tracker: any = null;
let wsClient: any = null; // WebSocket 客户端句柄
function startRecord() {
  ensureTools();
  if (!tools) return;
  tracker = tools.createTracker();
  tracker.startRecording();
  // 模拟外部数据推送（示例，仅示范）
  console.log("recording started");
  // === WebSocket 实时点接入：打开连接并把批次点推入 tracker ===
  if (!wsClient) {
    wsClient = createTrackWs({
      url: "wss://example.com/ws/track",
      token: undefined,
      batchMs: 200,
      onOpen: () => console.log("track ws open"),
      onClose: () => console.log("track ws close"),
      onError: (e: any) => console.error("track ws error", e),
      onBatch: (points: TrackMessage[]) => {
        if (!tracker) return;
        for (const p of points) tracker.pushPoint(p.x, p.y, p.t);
      },
    });
  }
}

function stopRecord() {
  if (!tracker) return;
  const data = tracker.stopRecording();
  console.log(
    "record stopped, path:",
    data.path.length,
    "timestamps:",
    data.timestamps.length
  );
  // 关闭 WebSocket（可选：如果希望持续接收可以不关闭）
  try {
    wsClient?.close?.();
  } catch (e) {
    /* ignore */
  }
  wsClient = null;
}

// 推送一个随机 mock 点到正在录制的 tracker
function pushMockPoint() {
  if (!tracker) return;
  // 使用北京市附近随机坐标
  const x = 116.397 + Math.random() * 0.01;
  const y = 39.909 + Math.random() * 0.01;
  tracker.pushPoint(x, y);
}

// 播放一个 mock 轨迹
async function playMockTrace() {
  ensureTools();
  if (!tools) return;
  const path = [
    [116.397428, 39.90923],
    [116.3985, 39.9105],
    [116.3998, 39.912],
  ];
  // tools 本身不直接暴露 play，需通过 createTracker 返回的 tracker 实例播放
  if (!tracker) tracker = tools.createTracker();

  // 在播放前将视图定位并放大到第一个点，改善播放体验
  try {
    const view = mapComp.value?.getView?.();
    if (view && path.length > 0) {
      const first = path[0];
      // 使用 goTo 接受 [lon, lat] 的中心点配置，设置一个合适的缩放级别
      // 不强制 await 过长时间，但等待 goTo 完成以避免播放时画面抖动
      // 默认缩放到 16（可根据需要调整）
      // 如果 goTo 抛错，则继续播放，不阻塞
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await view.goTo({ center: [first[0], first[1]], zoom: 16 });
    }
  } catch (err) {
    // 忽略定位错误，继续播放
    // eslint-disable-next-line no-console
    console.warn("goTo failed before playback:", err);
  }

  tracker.play(path, 400);
}

function toggleSampleLayer() {
  mapComp.value?.toggleLayerVisibility?.("sampleGraphics");
}

function showSampleLayer() {
  mapComp.value?.setLayerVisibility?.("sampleGraphics", true);
}

function hideSampleLayer() {
  mapComp.value?.setLayerVisibility?.("sampleGraphics", false);
}

function onToggleLayer(id: string) {
  mapComp.value?.toggleLayerVisibility?.(id);
}

function onRemoveLayer(id: string) {
  // 调用 arcgisMap 提供的 removeLayer API 从地图中彻底移除图层
  mapComp.value?.removeLayer?.(id);
}

function onSetLayerVisibility(payload: { id: string; visible: boolean }) {
  mapComp.value?.setLayerVisibility?.(payload.id, payload.visible);
}

/**
 * 导入电子地图（AMap）中的点到 ArcGIS（天地图）作为独立图层

 */
async function importAMapPointsToArcGIS() {
  try {
    const { data } = await mapListApi();
    if (!data || !Array.isArray(data)) return;

    const gl = new GraphicsLayer({
      id: "amapPoints",
      title: "电子地图点(AMap)",
    });

    const symbol = new PictureMarkerSymbol({
      url: icon,
      width: "28px",
      height: "28px",
    });

    const popup = new PopupTemplate({
      title: "{title}",
      content: function (feature: any) {
        // 弹框
        const attrs = feature.graphic?.attributes || feature.attributes || {};
        return `<div style="display:flex;padding:10px;align-items:center">
                  <div><img src="${
                    window.location.origin + station
                  }" width="200px" /></div>
                  <div style="width:180px;line-height:30px;margin-left:20px">
                    <h3>${attrs.title || attrs.name || ""}</h3>
                    <p>充电桩数量：${attrs.count ?? ""}</p>
                    <p>充电站状态：<span style="color:blue">${
                      attrs.status == 1 ? "使用中" : "维护中"
                    }</span></p>
                  </div>
                </div>`;
      },
    });

    for (const item of data) {
      const g = new Graphic({
        geometry: new Point({
          x: item.position[0],
          y: item.position[1],
          spatialReference: { wkid: 4326 },
        }),
        symbol,
        attributes: item,
        popupTemplate: popup,
      });
      gl.add(g);
    }

    mapComp.value?.addLayer(gl);
  } catch (err) {
    console.error("importAMapPointsToArcGIS error", err);
  }
}

// 引用一次以避免 TypeScript 报
void toggleSampleLayer;
</script>

<style scoped lang="scss">
/* component styles are inside arcgisMap */
.layer-panel {
  margin-top: 60px;
}
</style>
