// // クライアントのシステム情報を取得
// function getClientInfo() {
//     const clientInfo = {
//         os: navigator.platform,
//         browser: navigator.userAgent,
//         cores: navigator.hardwareConcurrency,
//         memory: (navigator as any).deviceMemory || "不明",
//         screenResolution: `${screen.width} x ${screen.height}`
//     };
//     return clientInfo;
// }
//
// // Pingを測定（指定したURLにリクエストを送る）
// async function getPing(url: string): Promise<number> {
//     const start = performance.now();
//     await fetch(url);
//     const end = performance.now();
//     return end - start; // ms単位のPing
// }
//
// // ダウンロード速度を測定
// async function getDownloadSpeed(fileUrl: string): Promise<string> {
//     const start = performance.now();
//     const response = await fetch(fileUrl);
//     const end = performance.now();
//     const fileSize = response.headers.get('content-length');
//
//     if (fileSize) {
//         const sizeInBits = parseInt(fileSize) * 8;
//         const durationInSeconds = (end - start) / 1000;
//         const speedBps = sizeInBits / durationInSeconds; // bits per second
//         const speedMbps = speedBps / (1024 * 1024); // Mbps
//         return `${speedMbps.toFixed(2)} Mbps`;
//     } else {
//         return "不明";
//     }
// }
//
// // 結果をまとめて表示
// async function displayClientEnvironment() {
//     const clientInfo = getClientInfo();
//     console.log("クライアント情報:", clientInfo);
//
//     // Ping測定 (Googleへのリクエスト例)
//     const ping = await getPing("https://www.google.com");
//     console.log(`Ping: ${ping.toFixed(2)} ms`);
//
//     // ダウンロード速度測定（任意の小さなファイルURL）
//     const downloadSpeed = await getDownloadSpeed("https://example.com/small-file");
//     console.log(`ダウンロード速度: ${downloadSpeed}`);
// }
//
// // クライアント環境情報を表示する
// displayClientEnvironment();

// クライアントのシステム情報を取得
function getClientInfo() {
    const clientInfo = {
        os: navigator.platform,
        browser: getBrowserInfo(),
        cores: navigator.hardwareConcurrency,
        memory: (navigator as any).deviceMemory || "不明",
        screenResolution: `${screen.width} x ${screen.height}`,
        heapSize: getHeapSize(),
        gpu: getGPUInfo()
    };
    return clientInfo;
}

// ブラウザ情報を取得
function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = "不明";
    let browserVersion = "不明";

    if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Chrome";
        browserVersion = userAgent.match(/Chrome\/(\d+\.\d+)/)?.[1] || "不明";
    } else if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Firefox";
        browserVersion = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || "不明";
    } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
        browserName = "Safari";
        browserVersion = userAgent.match(/Version\/(\d+\.\d+)/)?.[1] || "不明";
    }

    return `${browserName} ${browserVersion}`;
}

// GPU情報を取得 (WebGLを利用)
function getGPUInfo(): string {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (!gl) return "不明";

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        return `${vendor}, ${renderer}`;
    }
    return "不明";
}

// ヒープサイズ情報を取得
function getHeapSize(): string {
    if ((window as any).performance && (window as any).performance.memory) {
        const memoryInfo = (window as any).performance.memory;
        const heapSizeInGB = memoryInfo.jsHeapSizeLimit / (1024 * 1024 * 1024);
        return `${heapSizeInGB.toFixed(2)} GB`;
    }
    return "不明";
}

// 結果をまとめて表示
async function displayClientEnvironment() {
    const clientInfo = getClientInfo();
    console.log("クライアント情報:", clientInfo);

    // クライアント情報の表示
    document.body.innerHTML = `
    <div>
      <h2>クライアント情報</h2>
      <p>OS: ${clientInfo.os}</p>
      <p>ブラウザ: ${clientInfo.browser}</p>
      <p>CPUコア数: ${clientInfo.cores}</p>
      <p>スクリーン解像度: ${clientInfo.screenResolution}</p>
      <p>メモリ: ${clientInfo.memory}</p>
      <p>ヒープサイズ: ${clientInfo.heapSize}</p>
      <p>GPU: ${clientInfo.gpu}</p>
    </div>
  `;
}

// クライアント環境情報を表示する
displayClientEnvironment();