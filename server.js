const http = require('http');
const socketio = require('socket.io');

const app = require('./app');

// Create http server
const port = process.env.PORT || 8000;
const server = http.createServer(app);
const io = socketio(server);

// Middlewares
const { createTicket, joinTicket, sendAgentName, updateTickets } = require('./middlewares/ticket');
const { saveChat, getChat } = require('./middlewares/chat');

io.on('connection', socket => {
	console.log('New WS connection')

	socket.on('join-ticket', roomId => {
		// console.log(roomId);
		socket.join(roomId); // User join into the room
		io.to(roomId).emit('server-message', "a user connected into the server");
	});

	socket.on('user-message', ({roomId, msg}) => {
		console.log(`MSG = ${msg}`);
		socket.join(roomId);
		io.to(roomId).emit('user-message', msg);
	});
});

server.listen(port, () => console.log(`Server start at Port ${port}`));