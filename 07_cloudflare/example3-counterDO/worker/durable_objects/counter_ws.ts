import { DurableObject } from 'cloudflare:workers';

interface WebSocketMessage {
	type: 'update';
	value: number;
}

export class Counter extends DurableObject {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	async fetch(request: Request) {
		if (request.headers.get('Upgrade') !== 'websocket') {
			return new Response('Expected websocket', { status: 426 });
		}

		const pair = new WebSocketPair();
		const server = pair[1];
		this.ctx.acceptWebSocket(server);

		// Fetch the current value from storage and send it to the newly connected client.
		const value = (await this.ctx.storage.get<number>('value')) || 0;
		server.send(JSON.stringify({ type: 'update', value }));

		return new Response(null, {
			status: 101,
			webSocket: pair[0],
		});
	}

	async webSocketMessage(ws: WebSocket, message: string) {
		try {
			const data = JSON.parse(message);
			if (data.type === 'increment') {
				// Get the latest value from storage, increment, and save back.
				let value = (await this.ctx.storage.get<number>('value')) || 0;
				value++;
				await this.ctx.storage.put('value', value);

				this.broadcast({ type: 'update', value });
			}
		} catch (err) {
			ws.send(JSON.stringify({ error: 'Failed to parse message' }));
			console.error('Failed to parse message', err);
		}
	}

	async webSocketClose(
		ws: WebSocket,
		code: number,
		reason: string,
		wasClean: boolean
	) {
		console.log(
			`WebSocket closed: code=${code}, reason=${reason}, wasClean=${wasClean}`
		);
        ws.close();
	}

	async webSocketError(ws: WebSocket, error: unknown) {
		console.error('WebSocket error:', error);
        ws.close();
	}

	broadcast(message: WebSocketMessage) {
		const serializedMessage = JSON.stringify(message);
		for (const ws of this.ctx.getWebSockets()) {
			try {
				ws.send(serializedMessage);
			} catch (err) {
				console.error('Failed to send message to a session, it might be closed.', err);
			}
		}
	}
} 