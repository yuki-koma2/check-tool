// Bandwidth（回線速度）を測定
async function getBandwidth(): Promise<{ upload: string; download: string }> {
    const downloadTestUrl = "https://example.com/small-file"; // ダウンロード用ファイル
    const uploadTestUrl = "https://example.com/upload-endpoint"; // アップロード用URL

    // ダウンロード速度を測定
    const startDownload = performance.now();
    const downloadResponse = await fetch(downloadTestUrl);
    const endDownload = performance.now();
    const fileSize = downloadResponse.headers.get("content-length");

    let downloadSpeed = "不明";
    if (fileSize) {
        const sizeInBits = parseInt(fileSize) * 8;
        const durationInSeconds = (endDownload - startDownload) / 1000;
        const downloadBps = sizeInBits / durationInSeconds;
        downloadSpeed = `${(downloadBps / (1024 * 1024)).toFixed(2)} Mbps`;
    }

    // アップロード速度を測定（ダミーデータをアップロード）
    const uploadData = new Blob([new Uint8Array(1024 * 100)]); // 100KB
    const startUpload = performance.now();
    await fetch(uploadTestUrl, { method: "POST", body: uploadData });
    const endUpload = performance.now();

    const uploadBps = (uploadData.size * 8) / ((endUpload - startUpload) / 1000);
    const uploadSpeed = `${(uploadBps / (1024 * 1024)).toFixed(2)} Mbps`;

    return { upload: uploadSpeed, download: downloadSpeed };
}

// Ping（応答時間）を測定
async function getPing(url: string): Promise<number> {
    const start = performance.now();
    await fetch(url);
    const end = performance.now();
    return end - start; // ms
}

// IPアドレスと位置情報を取得
async function getIPAndLocation(): Promise<{ ip: string; location: string }> {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return {
        ip: data.ip,
        location: `${data.city}, ${data.country_name}`
    };
}

// ネットワーク情報を表示
async function displayNetworkInfo() {
    const bandwidth = await getBandwidth();
    const ping = await getPing("https://www.google.com");
    const ipAndLocation = await getIPAndLocation();

    console.log(`アップロード速度: ${bandwidth.upload}`);
    console.log(`ダウンロード速度: ${bandwidth.download}`);
    console.log(`Ping: ${ping.toFixed(2)} ms`);
    console.log(`IPアドレス: ${ipAndLocation.ip}`);
    console.log(`位置情報: ${ipAndLocation.location}`);

    // ネットワーク情報の表示
    document.body.innerHTML = `
    <div>
      <h2>ネットワーク情報</h2>
      <p>アップロード速度: ${bandwidth.upload}</p>
      <p>ダウンロード速度: ${bandwidth.download}</p>
      <p>Ping: ${ping.toFixed(2)} ms</p>
      <p>IPアドレス: ${ipAndLocation.ip}</p>
      <p>位置情報: ${ipAndLocation.location}</p>
    </div>
  `;
}

// ネットワーク情報を取得して表示
displayNetworkInfo();