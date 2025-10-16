// WebSocket 跟踪助手（TypeScript）
// 说明：这是一个轻量、健壮的 WebSocket 客户端，专为将实时轨迹点推送到地图 tracker（useMapTools.createTracker().pushPoint）设计。
// 特性：
// - 自动重连（指数退避）
// - 批量合并（节流）减少渲染压力
// - 基本字段校验、去重与时序排序
// - 可配置 token、batch interval、重连策略

export type TrackMessage = {
    deviceId?: string;
    x: number; // 经度
    y: number; // 纬度
    t: number; // 时间戳（ms）
    seq?: number; // 可选序号
    [k: string]: any;
};

export type TrackWsOptions = {
    url: string; // wss://host/path
    token?: string; // 可选 token
    autoReconnect?: boolean; // 默认为 true
    batchMs?: number; // 批处理间隔，默认 200ms
    reconnectMaxDelay?: number; // 最大重连间隔，默认 30000ms
    onOpen?: () => void;
    onClose?: (ev?: CloseEvent) => void;
    onError?: (ev?: Event) => void;
    onBatch?: (points: TrackMessage[]) => void; // 当一个批次准备好时回调
};

export function createTrackWs(opts: TrackWsOptions) {
    const {
        url,
        token,
        autoReconnect = true,
        batchMs = 200,
        reconnectMaxDelay = 30000,
        onOpen,
        onClose,
        onError,
        onBatch,
    } = opts;

    const wsUrl = token ? `${url}?token=${encodeURIComponent(token)}` : url;

    let ws: WebSocket | null = null;
    let closedByUser = false;
    let reconnectAttempt = 0;
    let batch: TrackMessage[] = [];
    let batchTimer: number | null = null;
    let lastT = 0;
    let lastSeq: number | null = null;

    function open() {
        closedByUser = false;
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            reconnectAttempt = 0;
            onOpen?.();
        };

        ws.onmessage = (ev) => {
            try {
                const data = JSON.parse(ev.data) as TrackMessage | TrackMessage[];
                if (Array.isArray(data)) {
                    for (const d of data) handleIncoming(d);
                } else {
                    handleIncoming(data);
                }
            } catch (e) {
                // 忽略解析错误
                // console.warn('ws parse error', e);
            }
        };

        ws.onerror = (ev) => {
            onError?.(ev);
        };

        ws.onclose = (ev) => {
            onClose?.(ev);
            ws = null;
            if (!closedByUser && autoReconnect) {
                reconnectAttempt++;
                const delay = Math.min(1000 * Math.pow(2, reconnectAttempt), reconnectMaxDelay);
                setTimeout(open, delay);
            }
        };
    }

    function handleIncoming(msg: TrackMessage) {
        // 基本校验
        if (!msg || typeof msg.x !== 'number' || typeof msg.y !== 'number' || typeof msg.t !== 'number') return;
        if (Math.abs(msg.x) > 180 || Math.abs(msg.y) > 90) return;

        // 去重/时序：忽略比已知最新点旧的点（若 seq 可用则兼顾 seq）
        if (msg.t <= lastT) {
            if (msg.seq != null && lastSeq != null) {
                if (msg.seq <= lastSeq) return;
            } else {
                return;
            }
        }

        batch.push(msg);
        if (!batchTimer) {
            batchTimer = window.setTimeout(flushBatch, batchMs);
        }
    }

    function flushBatch() {
        batchTimer = null;
        if (!batch.length) return;
        // 按时间排序，修正小乱序
        batch.sort((a, b) => a.t - b.t || (a.seq ?? 0) - (b.seq ?? 0));
        const last = batch[batch.length - 1];
        lastT = last.t;
        if (last.seq != null) lastSeq = last.seq;
        // 调用回调并清空批次
        onBatch?.(batch.slice());
        batch = [];
    }

    function close() {
        closedByUser = true;
        if (batchTimer) {
            clearTimeout(batchTimer);
            batchTimer = null;
        }
        if (ws) {
            try { ws.close(); } catch (e) { /* ignore */ }
            ws = null;
        }
    }

    // 允许手动发送心跳或命令（可选）
    function send(msg: any) {
        if (!ws || ws.readyState !== WebSocket.OPEN) return false;
        try { ws.send(JSON.stringify(msg)); return true; } catch (e) { return false; }
    }

    // 立即打开
    open();

    return { close, send, open };
}
