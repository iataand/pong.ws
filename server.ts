import express from 'express';
import { generateRoomId } from './utils';
import { initWsServer } from './socket';

const app = express();
const port = 3000;

const rooms: string[] = [];

app.use(express.static(`${__dirname}/public`));

app.get('/', (_, res) => {
	res.sendFile(`${__dirname}/index.html`);
});

app.get('/createRoom', async (_, res) => {
	const roomId = generateRoomId();

	try {
		await initWsServer(roomId);
		res.json({ roomId, message: `Room created with id: ${roomId}.` });
		rooms.push(roomId);

	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Unable to create room.' })
	}
});

app.get(`/room/${rooms[0]}`, async (_, res) => {

})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}.`)
});

