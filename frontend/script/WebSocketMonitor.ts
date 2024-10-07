class WebSocketMonitor {
    private ws: WebSocket;
    private latency: number = 0;
    private messageCountSent: number = 0;
    private messageCountReceived: number = 0;
    private errorCount: number = 0;
    private totalSentBytes: number = 0;
    private totalReceivedBytes: number = 0;
    private connectionDuration: number = 0;
    private reconnectAttempts: number = 0;
    private pingStart: number = 0;
    private connectionStart: number = 0;
    private intervalId: NodeJS.Timeout | null = null;

    constructor(private url: string) {
        this.initWebSocket();
    }

    private initWebSocket() {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            console.log('WebSocket接続成功');
            this.connectionStart = performance.now();
            this.startMonitoring();
        };

        this.ws.onmessage = (event: MessageEvent) => {
            this.handleMessage(event);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket エラー:', error);
            this.errorCount++;
        };

        this.ws.onclose = () => {
            console.log('WebSocket 接続が閉じられました');
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
            this.reconnect();
        };
    }

    private reconnect() {
        this.reconnectAttempts++;
        setTimeout(() => {
            console.log('再接続試行中...');
            this.initWebSocket();
        }, 1000); // 1秒後に再接続
    }

    private handleMessage(event: MessageEvent) {
        const messageSize = new Blob([event.data]).size;
        this.totalReceivedBytes += messageSize;
        this.messageCountReceived++;

        const data = JSON.parse(event.data);
        if (data.type === 'pong') {
            this.latency = performance.now() - this.pingStart;
            console.log(`Latency: ${this.latency.toFixed(2)} ms`);
        }
    }

    private startMonitoring() {
        // Ping送信とLatency測定
        this.intervalId = setInterval(() => {
            this.pingStart = performance.now();
            const pingMessage = JSON.stringify({ type: 'ping' });
            this.ws.send(pingMessage);
            this.totalSentBytes += new Blob([pingMessage]).size;
            this.messageCountSent++;
        }, 5000); // 5秒ごとにPingを送信

        // 定期的に接続時間やデータ転送量などをログに出力
        setInterval(() => {
            this.connectionDuration = performance.now() - this.connectionStart;
            this.logMetrics();
        }, 10000); // 10秒ごとにメトリクスを出力
    }

    private logMetrics() {
        console.log(`接続時間: ${(this.connectionDuration / 1000).toFixed(2)} 秒`);
        console.log(`メッセージ送信数: ${this.messageCountSent}`);
        console.log(`メッセージ受信数: ${this.messageCountReceived}`);
        console.log(`エラー数: ${this.errorCount}`);
        console.log(`送信データ量: ${(this.totalSentBytes / 1024).toFixed(2)} KB`);
        console.log(`受信データ量: ${(this.totalReceivedBytes / 1024).toFixed(2)} KB`);
        console.log(`再接続試行回数: ${this.reconnectAttempts}`);
        console.log(`現在のLatency: ${this.latency.toFixed(2)} ms`);
    }
}

// WebSocket監視を開始
const monitor = new WebSocketMonitor('wss://example.com/socket');