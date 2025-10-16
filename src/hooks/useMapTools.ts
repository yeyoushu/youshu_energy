import type MapView from "@arcgis/core/views/MapView";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import Polyline from "@arcgis/core/geometry/Polyline";
import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";
import { ElMessageBox } from "element-plus";

/**
 * useMapTools 钩子
 * - measureArea(view): 打开绘制多边形并返回 { area, rings }
 * - measureLength(view): 打开绘制折线并返回 { length, paths }
 * - createTracker(view): 返回 { startRecording(), stopRecording(), play(trace), stopPlay(), onData(cb) }
 *
 * 说明：
 * - 所有操作仅通过传入的 view 操作地图（添加/移除 GraphicsLayer、Graphic），不直接修改外部组件状态。
 * - 绘制完成可能会通过不同事件或数据结构结束（例如双击结束可能没有 evt.geometry），代码对 evt.geometry 做回退处理，优先使用 evt.geometry，其次使用 evt.vertices 或 action.vertices。
 */

export function useMapTools(view: MapView) {
    // 复用一个 measurement layer 与 SketchViewModel，避免频繁创建/销毁图层和多余监听
    const MEASURE_LAYER_ID = 'measurement-layer';
    const m = (view as any).map;
    let measurementLayer: GraphicsLayer | null = null;
    if (!m) throw new Error('map not available');
    const existing = typeof m.findLayerById === 'function' ? m.findLayerById(MEASURE_LAYER_ID) : null;
    if (existing) {
        measurementLayer = existing as GraphicsLayer;
    } else {
        measurementLayer = new GraphicsLayer({ id: MEASURE_LAYER_ID });
        try { m.add(measurementLayer); } catch (e) { /* ignore */ }
    }

    // 预定义符号，供 Sketch 使用（临时与最终样式）
    const tempFill = new SimpleFillSymbol({ color: [255, 165, 0, 0.25], outline: { color: [255, 165, 0], width: 2 } });
    const finalFill = new SimpleFillSymbol({ color: [255, 165, 0, 0.6], outline: { color: [255, 165, 0], width: 2 } });
    const tempLine = new SimpleLineSymbol({ color: [0, 120, 255], width: 3 });
    const finalLine = new SimpleLineSymbol({ color: [0, 120, 255], width: 4 });

    const sketch = new SketchViewModel({ view, layer: measurementLayer, polygonSymbol: tempFill, polylineSymbol: tempLine });

    // 活动测量的状态与句柄（确保单次 active）
    let activeHandle: any = null;
    let activeReject: ((e?: any) => void) | null = null;

    // 通用清理 active 流程
    function cleanupActive() {
        try { if (activeHandle && activeHandle.remove) activeHandle.remove(); } catch (e) { }
        activeHandle = null;
        activeReject = null;
    }

    // （已撤回）投影相关计算暂不使用，直接使用 geometryEngine 的 geodesic 计算

    // 测量面积（基于 SketchViewModel，兼容双击结束）
    function measureArea(): Promise<{ area: number; rings: number[][] } | null> {
        // 如果已有正在进行的测量，先取消并清理
        if (activeReject) {
            try { sketch.cancel(); } catch (e) { }
            activeReject(new Error('New measurement started'));
            cleanupActive();
        }
        return new Promise((resolve, reject) => {
            activeReject = reject;

            activeHandle = sketch.on('create', async (evt: any) => {
                if (evt.state === 'complete') {
                    // 正常完成，尽量从 evt.graphic.geometry 取值，回退使用 evt.vertices
                    let geom = evt.graphic && evt.graphic.geometry ? evt.graphic.geometry as Polygon : undefined;
                    if (!geom) {
                        const verts = evt.vertices || (evt && evt.graphic && (evt.graphic as any).rings);
                        if (verts && verts.length) {
                            geom = new Polygon({ rings: verts, spatialReference: view.spatialReference });
                        }
                    }
                    if (!geom) {
                        reject(new Error('no geometry')); cleanupActive(); return;
                    }
                    // 弹出确认框
                    try {
                        await ElMessageBox.confirm('确认使用该面并计算面积吗？', '确认', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' });
                    } catch (e) {
                        // 取消则从 layer 中移除当前 graphic（Sketch 会自动加入 layer）
                        try { if (evt.graphic && measurementLayer) measurementLayer.remove(evt.graphic); } catch (e) { }
                        resolve(null);
                        cleanupActive();
                        return;
                    }
                    // 确认：设置最终样式并计算面积，保留图形
                    try { if (evt.graphic) (evt.graphic as any).symbol = finalFill; } catch (e) { }
                    // 计算面积并添加标签（使用 geometryEngine 的 geodesic 计算）
                    const area = geometryEngine.geodesicArea(geom as any, 'square-meters');
                    const centroid: Point | null = (geom as any).centroid || ((geom as any).extent && (geom as any).extent.center) || null;
                    if (centroid) {
                        const text = new TextSymbol({ text: `${area.toFixed(2)} m²`, color: [255, 0, 0], font: { size: 12 } });
                        try { measurementLayer?.add(new Graphic({ geometry: centroid as any, symbol: text })); } catch (e) { }
                    }
                    resolve({ area, rings: (geom as any).rings[0] });
                    cleanupActive();
                } else if (evt.state === 'abort' || evt.state === 'cancel') {
                    // 用户取消
                    reject(new Error('measure canceled'));
                    cleanupActive();
                }
            });

            // 启动绘制（单击绘制，双击结束）
            try { sketch.create('polygon', { mode: 'click' }); } catch (e) { reject(e); cleanupActive(); }
        });
    }

    // 测量长度（基于 SketchViewModel，兼容双击结束）
    function measureLength(): Promise<{ length: number; paths: number[][] } | null> {
        if (activeReject) {
            try { sketch.cancel(); } catch (e) { }
            activeReject(new Error('New measurement started'));
            cleanupActive();
        }
        return new Promise((resolve, reject) => {
            activeReject = reject;

            activeHandle = sketch.on('create', async (evt: any) => {
                if (evt.state === 'complete') {
                    let geom = evt.graphic && evt.graphic.geometry ? evt.graphic.geometry as Polyline : undefined;
                    if (!geom) {
                        const verts = evt.vertices || (evt && evt.graphic && (evt.graphic as any).paths);
                        if (verts && verts.length) {
                            geom = new Polyline({ paths: verts, spatialReference: view.spatialReference });
                        }
                    }
                    if (!geom) { reject(new Error('no geometry')); cleanupActive(); return; }
                    try {
                        await ElMessageBox.confirm('确认使用该线并计算长度吗？', '确认', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' });
                    } catch (e) {
                        try { if (evt.graphic && measurementLayer) measurementLayer.remove(evt.graphic); } catch (e) { }
                        resolve(null); cleanupActive(); return;
                    }
                    try { if (evt.graphic) (evt.graphic as any).symbol = finalLine; } catch (e) { }
                    // 计算长度（直接使用 geometryEngine 的 geodesicLength）
                    const len = geometryEngine.geodesicLength(geom as any, 'meters');
                    const path = (geom as any).paths && (geom as any).paths[0] ? (geom as any).paths[0] : (evt.vertices || []);
                    if (path && path.length) {
                        const first = path[0]; const last = path[path.length - 1];
                        const labelPoint = new Point({ x: (first[0] + last[0]) / 2, y: (first[1] + last[1]) / 2, spatialReference: view.spatialReference });
                        const text = new TextSymbol({ text: `${len.toFixed(2)} m`, color: [255, 0, 0], font: { size: 12 } });
                        try { measurementLayer?.add(new Graphic({ geometry: labelPoint as any, symbol: text })); } catch (e) { }
                    }
                    resolve({ length: len, paths: path });
                    cleanupActive();
                } else if (evt.state === 'abort' || evt.state === 'cancel') {
                    reject(new Error('measure canceled'));
                    cleanupActive();
                }
            });

            try { sketch.create('polyline', { mode: 'click' }); } catch (e) { reject(e); cleanupActive(); }
        });
    }

    // 创建轨迹录制/播放工具：
    // - startRecording(): 开始录制（在 recordLayer 上绘制点）
    // - stopRecording(): 停止并返回 { path, timestamps }
    // - pushPoint(x,y,t): 外部推送点到当前录制（例如 websocket）
    // - play(path, interval): 播放给定路径
    // - stopPlay(): 停止播放并清理
    // - onData(cb): 监听每个点被推入时的回调
    function createTracker() {
        // 录制/播放轨迹
        let recording = false;
        let playing = false;
        let recordLayer: GraphicsLayer | null = null;
        let playLayer: GraphicsLayer | null = null;
        let path: number[][] = [];
        let timestamps: number[] = [];
        let listeners: Array<(point: { x: number; y: number; t: number }) => void> = [];

        function onData(cb: (point: { x: number; y: number; t: number }) => void) {
            listeners.push(cb);
        }

        function startRecording() {
            if (recording) return;
            recording = true;
            recordLayer = new GraphicsLayer({ id: `track-record-${Date.now()}` });
            const m = (view as any).map;
            if (m) m.add(recordLayer);
            path = [];
            timestamps = [];
        }

        function stopRecording() {
            recording = false;
            return { path, timestamps };
        }

        // 外部推送数据点（例如来自 websocket 或 api）
        function pushPoint(x: number, y: number, t?: number) {
            if (!recording || !recordLayer) return;
            const ts = t ?? Date.now();
            path.push([x, y]);
            timestamps.push(ts);
            // incoming x/y are lon/lat (WGS84), ensure geometry uses 4326 so it renders correctly
            const marker = new Graphic({ geometry: new Point({ x, y, spatialReference: { wkid: 4326 } }), symbol: new SimpleMarkerSymbol({ size: 6, color: [255, 0, 0] }) });
            recordLayer.add(marker);
            for (const cb of listeners) cb({ x, y, t: ts });
        }

        // 播放已有轨迹 path: Array<[x,y]> ; interval ms
        let playTimer: any = null;
        function play(existingPath: number[][], interval = 500) {
            if (playing) return;
            playing = true;
            playLayer = new GraphicsLayer({ id: `track-play-${Date.now()}` });
            // 创建或复用用于显示持久轨迹的图层（route-layer），该图层在 stopPlay 时不移除，便于回看
            const ROUTE_LAYER_ID = 'track-route-layer';
            let routeLayer: GraphicsLayer | null = null;
            try {
                const mm = (view as any).map;
                if (mm) {
                    const found = typeof mm.findLayerById === 'function' ? mm.findLayerById(ROUTE_LAYER_ID) : null;
                    if (found) routeLayer = found as GraphicsLayer;
                    else {
                        routeLayer = new GraphicsLayer({ id: ROUTE_LAYER_ID });
                        mm.add(routeLayer);
                    }
                }
            } catch (e) {
                // ignore route layer creation errors
            }
            // 如果有传入的 path，构造并添加一条持久的 Polyline（WGS84）到 routeLayer
            try {
                if (routeLayer && existingPath && existingPath.length) {
                    const poly = new Polyline({ paths: [existingPath], spatialReference: { wkid: 4326 } });
                    const lineSym = new SimpleLineSymbol({ color: [255, 0, 0], width: 3 });
                    const routeGraphic = new Graphic({ geometry: poly, symbol: lineSym });
                    routeLayer.add(routeGraphic);
                }
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error('failed to create persistent route polyline', e);
            }
            const m = (view as any).map;
            try {
                if (m) m.add(playLayer);
            } catch (e) {
                // 如果添加图层失败，记录并继续（后续会显式检查）
                // eslint-disable-next-line no-console
                console.error('failed to add playLayer to map', e);
            }
            let idx = 0;
            // debug 输出：path 长度
            // eslint-disable-next-line no-console
            console.debug('tracker.play starting, points:', existingPath.length, 'interval:', interval);
            playTimer = setInterval(() => {
                if (idx >= existingPath.length) {
                    stopPlay();
                    return;
                }
                const p = existingPath[idx];
                // existingPath is array of [lon, lat] (WGS84). Create Point with 4326 so it's interpreted correctly.
                const pt = new Point({ x: p[0], y: p[1], spatialReference: { wkid: 4326 } });
                const g = new Graphic({ geometry: pt, symbol: new SimpleMarkerSymbol({ size: 10, color: [255, 0, 0] }) });
                try { playLayer!.add(g); } catch (e) { /* eslint-disable-next-line no-console */ console.error('add graphic to playLayer failed', e); }
                idx++;
            }, interval);
        }

        function stopPlay() {
            playing = false;
            if (playTimer) {
                clearInterval(playTimer);
                playTimer = null;
            }
            if (playLayer) {
                // 仅移除动画点，不移除持久化的 routeLayer
                playLayer.removeAll();
                const m2 = (view as any).map;
                try { if (m2) m2.remove(playLayer); } catch (e) { }
                playLayer = null;
            }
        }

        return {
            startRecording,
            stopRecording,
            pushPoint,
            play,
            stopPlay,
            onData,
        };
    }

    return {
        measureArea,
        measureLength,
        createTracker,
    };
}

export default useMapTools;
// ...existing code...

/**
 * WebSocket 轨迹实时跟踪集成示例
 * 用法：在页面/组件中调用
 * 
 * const tracker = useMapTools(view).createTracker();
 * tracker.startRecording();
 * 
 * // 建立 WebSocket 连接
 * const ws = new WebSocket('wss://your-server/ws/track');
 * ws.onmessage = (event) => {
 *   // 假设后端推送 { x: 经度, y: 纬度, t: 时间戳 }
 *   const { x, y, t } = JSON.parse(event.data);
 *   tracker.pushPoint(x, y, t);
 * };
 * 
 * // 停止录制
 * tracker.stopRecording();
 * // 播放轨迹
 * tracker.play(tracker.path, 400);
 */