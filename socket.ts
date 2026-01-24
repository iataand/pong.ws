import { WebSocketServer } from "ws";

export function initWsServer(roomId: string): Promise<WebSocketServer> {
	return new Promise((resolve, reject) => {
		const wss = new WebSocketServer({ host: 'localhost', path: `/${roomId}`, port: 8080 });

		wss.once('error', (err) => {
			reject(new Error(`Failed to start WebSocketServer for room "${roomId}": ${err.message}`));
		});

		wss.once('listening', () => {
			resolve(wss);
		});

		wss.on('connection', (ws) => {
			ws.on('message', (data) => {
				console.log(`received: ${data}`);
				ws.send(data);
			});
		});
	});
}
