const WebSocket = require('ws');

// WebSocketサーバーをポート8080で作成
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('クライアントが接続しました');

    // クライアントからメッセージを受信した時の処理
    ws.on('message', (message) => {
        console.log(`受信メッセージ: ${message}`);

        // クライアントに返信する
        ws.send(`サーバーからの返信: ${message}`);
    });

    // 接続が閉じられた時の処理
    ws.on('close', () => {
        console.log('クライアントが切断されました');
    });

    // エラー処理
    ws.on('error', (error) => {
        console.error('WebSocket エラー:', error);
    });

    // クライアントに初回メッセージを送信
    ws.send('WebSocketサーバーに接続しました');
});

console.log('WebSocketサーバーはポート8080で待機しています');