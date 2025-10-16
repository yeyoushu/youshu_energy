<template>
  <div ref="mapRef" class="map-view"></div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted, toRef } from "vue";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
// Basemap import removed — we control baseLayers visibility instead of replacing basemap

interface Props {
  center?: [number, number];
  zoom?: number;
}

const props = defineProps<Props>();
const mapRef = ref<HTMLDivElement>();
const view = shallowRef<MapView | null>(null);

// 将底图图层引用提升到模块级，避免在每次 initMap 时重复创建
let tdtLayer: WebTileLayer | null = null;
let tdtAnnoLayer: WebTileLayer | null = null;
let tdtImgLayer: WebTileLayer | null = null;
let tdtImgAnnoLayer: WebTileLayer | null = null;

const center = toRef(props, "center");
const zoom = toRef(props, "zoom");
const token = import.meta.env.VITE_TIANDITU_KEY;
const emit = defineEmits<{
  (e: "basemap-change", mode: "vec" | "img"): void;
  (
    e: "layer-list-changed",
    list: Array<{ id: string; title?: string; visible?: boolean }>
  ): void;
  (e: "ready"): void;
}>();

/**
 * 初始化地图并创建 MapView
 *
 * 说明：
 * - 在容器存在时构建或复用天地图底图/注记图层实例，并创建 ArcGIS Map 与 MapView。
 * - 该函数是幂等的：多次调用不会重复创建相同的图层对象（内部使用模块级缓存）。
 *
 * 参数：无
 * 返回：无
 * 副作用：会在 map 容器中渲染地图并分配 `view.value`。
 */
function initMap() {
  if (!mapRef.value) return;

  // 只在未创建时构建底图图层实例，避免重复
  if (!tdtLayer) {
    tdtLayer = new WebTileLayer({
      id: "tdtVecLayer",
      title: "天地图矢量",
      subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
      urlTemplate:
        "https://{subDomain}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=" +
        token,
    });
  }
  if (!tdtAnnoLayer) {
    tdtAnnoLayer = new WebTileLayer({
      id: "tdtAnnoLayer",
      title: "天地图注记",
      subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
      urlTemplate:
        "https://{subDomain}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=" +
        token,
      opacity: 1,
    });
  }

  // 影像底图与注记（影像 + 影像注记）
  if (!tdtImgLayer) {
    tdtImgLayer = new WebTileLayer({
      id: "tdtImgLayer",
      title: "天地图影像",
      subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
      urlTemplate:
        "https://{subDomain}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=" +
        token,
    });
  }

  if (!tdtImgAnnoLayer) {
    tdtImgAnnoLayer = new WebTileLayer({
      id: "tdtImgAnnoLayer",
      title: "天地图影像注记",
      subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
      urlTemplate:
        "https://{subDomain}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=" +
        token,
      opacity: 1,
    });
  }

  // 已在模块级确保 tdtImgLayer/tdtImgAnnoLayer 被创建

  // 将所有四个天地图图层加入 basemap，但通过 visible 控制默认显示为影像 + 注记
  const vecLayers = [tdtLayer!, tdtAnnoLayer!];
  const imgLayers = [tdtImgLayer!, tdtImgAnnoLayer!];
  // 设置默认可见性：影像系列可见，矢量系列不可见
  tdtLayer!.visible = false;
  tdtAnnoLayer!.visible = false;
  tdtImgLayer!.visible = true;
  tdtImgAnnoLayer!.visible = true;

  const map = new Map({
    basemap: {
      baseLayers: [...vecLayers, ...imgLayers],
    },
  });

  view.value = new MapView({
    container: mapRef.value,
    map,
    center: center.value ?? [116.397428, 39.90923],
    zoom: zoom.value ?? 12,
  });

  view.value.when(() => {
    // ready
    console.log("[arcgisMap] map initialized");
    // 通知父组件：map 已就绪
    emit("ready");
    // 在地图就绪时立即发送当前图层列表，确保父组件可以立刻渲染图层面板
    try {
      getLayerList();
    } catch (e) {
      console.warn("[arcgisMap] failed to emit initial layer list", e);
    }
  });
}

/**
 * 销毁地图视图并清理引用
 *
 * 说明：
 * - 调用 MapView.destroy() 以释放资源并将内部引用置空，避免内存泄漏。
 * - 安全调用：内部使用 try/catch 捕获异常并记录日志。
 *
 * 参数：无
 * 返回：无
 */
function destroyMap() {
  if (!view.value) return;
  try {
    view.value.destroy();
    // 清理引用
    view.value = null;
    console.log("[arcgisMap] map destroyed successfully");
  } catch (err) {
    console.error("[arcgisMap] failed to destroy map instance:", err);
  }
}

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  destroyMap();
});

/**
 * 触发 MapView 的 resize（用于容器尺寸变化后手动触发重绘）
 *
 * 说明：
 * - 某些环境中在容器尺寸变化或隐藏/显示切换后需要手动触发 view.resize()。
 * - 该函数对不同 ArcGIS API 版本做了保护性判断（若存在 resize 方法则调用）。
 *
 * 参数：无
 * 返回：无
 */
function resizeMap() {
  if (!view.value) return;
  try {
    // MapView 的 resize 方法在 API 中可用
    // 有些版本可能需要调用 view.resize() 或 view.container = ... 后触发 resize
    // 这里直接调用以支持常见用例
    // @ts-ignore
    view.value.resize && view.value.resize();
    console.log("[arcgisMap] map resized");
  } catch (err) {
    console.error("[arcgisMap] failed to resize map:", err);
  }
}

/**
 * 设置地图中心点
 *
 * 参数：
 * - centerCoords: [lng, lat]（经度，纬度，WGS84/4326）
 *
 * 返回：无
 */
function setCenter(centerCoords: [number, number]) {
  if (!view.value) return;
  try {
    // 使用 goTo 更加平滑和通用
    view.value.goTo({ center: centerCoords });
    console.log("[arcgisMap] set center to", centerCoords);
  } catch (err) {
    console.error("[arcgisMap] failed to set center:", err);
  }
}

/**
 * 设置地图缩放级别
 *
 * 参数：
 * - z: 缩放级别（number）
 *
 * 返回：无
 */
function setZoom(z: number) {
  if (!view.value) return;
  try {
    view.value.goTo({ zoom: z });
    console.log("[arcgisMap] set zoom to", z);
  } catch (err) {
    console.error("[arcgisMap] failed to set zoom:", err);
  }
}

/**
 * 向地图中添加图层
 *
 * 说明：
 * - 优先调用 map.add(layer)。若 map 不支持则尝试 map.layers.add 或 basemap.baseLayers.add。
 * - 适用于要动态添加 FeatureLayer、GraphicsLayer、TileLayer 等。
 *
 * 参数：
 * - layer: ArcGIS Layer 实例
 * 返回：无
 */
function addLayer(layer: any) {
  if (!view.value) {
    console.warn("[arcgisMap] no view to add layer to");
    return;
  }
  const m: any = (view.value as any).map;
  if (!m) {
    console.warn("[arcgisMap] view has no map to add layer to");
    return;
  }
  try {
    if (typeof m.add === "function") {
      m.add(layer);
    } else if (m.layers && typeof m.layers.add === "function") {
      m.layers.add(layer);
    } else if (
      m.basemap &&
      m.basemap.baseLayers &&
      typeof m.basemap.baseLayers.add === "function"
    ) {
      m.basemap.baseLayers.add(layer);
    } else {
      console.warn(
        "[arcgisMap] cannot find suitable add() on map to insert layer"
      );
      return;
    }
    console.log("[arcgisMap] layer added");
    // 图层列表变更，通知父组件（getLayerList 内部会 emit）
    getLayerList();
  } catch (err) {
    console.error("[arcgisMap] failed to add layer:", err);
  }
}

/**
 * 设置指定图层的可见性
 *
 * 参数：
 * - layerId: 图层 id
 * - visible: 是否可见（true/false）
 *
 * 返回：无
 */
function setLayerVisibility(layerId: string, visible: boolean) {
  try {
    const mapInstance: any = (view.value as any)?.map;
    if (!mapInstance) return;
    // 同时搜索 map.layers 与 basemap.baseLayers
    const mapLayers = mapInstance.layers
      ? Array.isArray(mapInstance.layers)
        ? mapInstance.layers
        : Array.from(mapInstance.layers)
      : [];
    const baseLayers =
      mapInstance.basemap && mapInstance.basemap.baseLayers
        ? Array.isArray(mapInstance.basemap.baseLayers)
          ? mapInstance.basemap.baseLayers
          : Array.from(mapInstance.basemap.baseLayers)
        : [];

    const all = [...mapLayers, ...baseLayers];
    const target = all.find((l: any) => l && l.id === layerId);
    if (target) {
      target.visible = visible;
      console.log(`[arcgisMap] layer ${layerId} visibility ->`, visible);
      getLayerList();
      return;
    }
    console.warn(`[arcgisMap] layer ${layerId} not found`);
  } catch (err) {
    console.error("[arcgisMap] failed to set layer visibility:", err);
  }
}

/**
 * 切换图层可见性
 *
 * 参数：
 * - layerId: 图层 id
 *
 * 返回：无
 */
function toggleLayerVisibility(layerId: string) {
  try {
    const mapInstance: any = (view.value as any)?.map;
    if (!mapInstance) return;
    const mapLayers = mapInstance.layers
      ? Array.isArray(mapInstance.layers)
        ? mapInstance.layers
        : Array.from(mapInstance.layers)
      : [];
    const baseLayers =
      mapInstance.basemap && mapInstance.basemap.baseLayers
        ? Array.isArray(mapInstance.basemap.baseLayers)
          ? mapInstance.basemap.baseLayers
          : Array.from(mapInstance.basemap.baseLayers)
        : [];
    const all = [...mapLayers, ...baseLayers];
    const target = all.find((l: any) => l && l.id === layerId);
    if (target) {
      target.visible = !target.visible;
      console.log(`[arcgisMap] toggled layer ${layerId} ->`, target.visible);
      getLayerList();
      return;
    }
    console.warn(`[arcgisMap] layer ${layerId} not found`);
  } catch (err) {
    console.error("[arcgisMap] failed to toggle layer visibility:", err);
  }
}

/**
 * 从地图中移除指定图层
 *
 * 参数：
 * - layerId: 要移除的图层 id
 *
 * 返回：无
 */
function removeLayer(layerId: string) {
  try {
    const mapInstance: any = (view.value as any)?.map;
    if (!mapInstance) return;
    // 查找 map.layers 与 basemap.baseLayers 中的目标
    const mapLayers = mapInstance.layers
      ? Array.isArray(mapInstance.layers)
        ? mapInstance.layers
        : Array.from(mapInstance.layers)
      : [];
    const baseLayers =
      mapInstance.basemap && mapInstance.basemap.baseLayers
        ? Array.isArray(mapInstance.basemap.baseLayers)
          ? mapInstance.basemap.baseLayers
          : Array.from(mapInstance.basemap.baseLayers)
        : [];

    let target = mapLayers.find((l: any) => l && l.id === layerId);
    if (target) {
      if (typeof mapInstance.remove === "function") {
        mapInstance.remove(target);
      } else if (
        mapInstance.layers &&
        typeof mapInstance.layers.remove === "function"
      ) {
        mapInstance.layers.remove(target);
      } else {
        console.warn(
          "[arcgisMap] cannot find suitable remove() on map to remove layer from map.layers"
        );
        return;
      }
      console.log("[arcgisMap] layer removed from map.layers", layerId);
      getLayerList();
      return;
    }

    target = baseLayers.find((l: any) => l && l.id === layerId);
    if (target) {
      if (
        mapInstance.basemap &&
        mapInstance.basemap.baseLayers &&
        typeof mapInstance.basemap.baseLayers.remove === "function"
      ) {
        mapInstance.basemap.baseLayers.remove(target);
        console.log(
          "[arcgisMap] layer removed from basemap.baseLayers",
          layerId
        );
        getLayerList();
        return;
      } else {
        console.warn(
          "[arcgisMap] cannot find suitable remove() on basemap.baseLayers to remove layer"
        );
        return;
      }
    }

    console.warn(`[arcgisMap] layer ${layerId} not found for removal`);
  } catch (err) {
    console.error("[arcgisMap] failed to remove layer:", err);
  }
}

/**
 * 获取当前地图的图层信息列表（安全的纯数据副本）
 *
 * 说明：
 * - 返回的每一项为纯 JS 对象 {id, title, visible}，避免将 ArcGIS 内部代理对象直接传给 Vue 渲染层。
 * - 函数会 emit `layer-list-changed` 事件，携带最新图层列表，供父组件自动同步 UI。
 *
 * 返回：Array<{id: string, title?: string, visible: boolean}>
 */
function getLayerList() {
  try {
    const mapInstance: any = (view.value as any)?.map;
    if (!mapInstance) return [];
    // 合并 map.layers 与 basemap.baseLayers 两个来源，优先按 layer.id 去重
    const fromMap = mapInstance.layers
      ? Array.isArray(mapInstance.layers)
        ? mapInstance.layers
        : Array.from(mapInstance.layers)
      : [];
    const fromBasemap =
      mapInstance.basemap && mapInstance.basemap.baseLayers
        ? Array.isArray(mapInstance.basemap.baseLayers)
          ? mapInstance.basemap.baseLayers
          : Array.from(mapInstance.basemap.baseLayers)
        : [];

    const combined = [...fromMap, ...fromBasemap];
    const uniqueById: { [id: string]: any } = {};
    for (const lyr of combined) {
      const id = lyr?.id ?? "";
      if (!id) continue;
      if (!(id in uniqueById)) uniqueById[id] = lyr;
    }

    const list = Object.values(uniqueById).map((l: any) => ({
      id: l?.id ?? "",
      title: l?.title ?? "",
      visible: !!l?.visible,
    }));
    // 通知父组件当前图层列表已更新
    emit("layer-list-changed", list);
    return list;
  } catch (err) {
    console.error("[arcgisMap] getLayerList error:", err);
    return [];
  }
}

/**
 * 切换底图（以替换 Basemap）
 *
 * 说明：
 * - mode = 'vec' 使用天地图矢量底图 + 注记；mode = 'img' 使用天地图影像底图 + 注记。
 * - 通过构建新的 Basemap 实例替换 map.basemap，以便清晰管理 basemap 元数据。
 *
 * 参数：
 * - mode: 'vec' | 'img'
 * 返回：无
 */
function switchBasemap(mode: "vec" | "img") {
  try {
    const mapInstance: any = (view.value as any)?.map;
    if (!mapInstance) return;
    // 通过设置 visible 来控制已有 basemap.baseLayers 显示，而不是替换 basemap
    const baseLayers = mapInstance.basemap?.baseLayers
      ? Array.isArray(mapInstance.basemap.baseLayers)
        ? mapInstance.basemap.baseLayers
        : Array.from(mapInstance.basemap.baseLayers)
      : [];

    for (const lyr of baseLayers) {
      if (!lyr || !lyr.id) continue;
      if (mode === "vec") {
        // 显示矢量系列，隐藏影像系列
        if (lyr.id === "tdtVecLayer" || lyr.id === "tdtAnnoLayer")
          lyr.visible = true;
        else if (lyr.id === "tdtImgLayer" || lyr.id === "tdtImgAnnoLayer")
          lyr.visible = false;
      } else {
        // 显示影像系列，隐藏矢量系列
        if (lyr.id === "tdtImgLayer" || lyr.id === "tdtImgAnnoLayer")
          lyr.visible = true;
        else if (lyr.id === "tdtVecLayer" || lyr.id === "tdtAnnoLayer")
          lyr.visible = false;
      }
    }

    console.log("[arcgisMap] switched basemap visibility to", mode);
    emit("basemap-change", mode);
  } catch (err) {
    console.error("[arcgisMap] failed to replace basemap:", err);
  }
}

/**
 * 获取当前 basemap 模式
 *
 * 返回：'vec' | 'img'
 */
function getBasemapMode(): "vec" | "img" {
  const mapInstance: any = (view.value as any)?.map;
  if (!mapInstance || !mapInstance.basemap) return "vec";
  const ids = (mapInstance.basemap.baseLayers || []).map((l: any) => l.id);
  if (ids.includes("tdtImgLayer")) return "img";
  return "vec";
}

// 向父组件暴露方法以便显式调用
defineExpose({
  initMap,
  destroyMap,
  resizeMap,
  setCenter,
  setZoom,
  addLayer,
  switchBasemap,
  getBasemapMode,
  setLayerVisibility,
  toggleLayerVisibility,
  removeLayer,
  getLayerList,
  // 返回底层 MapView 实例以便外部工具（例如绘图/测量/轨迹播放器）使用
  getView() {
    return view.value;
  },
});
</script>

<style scoped>
.map-view {
  width: 100%;
  height: 100vh;
}
</style>
