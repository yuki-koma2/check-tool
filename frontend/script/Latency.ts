// 特定のAPIに対するLatency（遅延時間）を測定
async function getApiLatency(apiUrl: string): Promise<number> {
    const start = performance.now();
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
    } catch (error) {
        console.error("API request failed:", error);
        return -1; // エラーの場合は -1 を返す
    }
    const end = performance.now();
    return end - start; // Latency（ms）
}

// API Latencyを表示
async function displayApiLatency() {
    const apiUrl = "https://example.com/api"; // 測定したいAPIのURL
    const latency = await getApiLatency(apiUrl);

    if (latency >= 0) {
        console.log(`API Latency: ${latency.toFixed(2)} ms`);
    } else {
        console.log("API request failed.");
    }

    // 結果をHTMLに表示
    document.body.innerHTML = `
    <div>
      <h2>API Latency</h2>
      <p>API: ${apiUrl}</p>
      <p>Latency: ${latency >= 0 ? latency.toFixed(2) + " ms" : "API request failed"}</p>
    </div>
  `;
}

// API Latencyを取得して表示
displayApiLatency();