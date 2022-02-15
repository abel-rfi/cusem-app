const http = require('http');
const socketio = require('socket.io');

const app = require('./app');

// Create http server
const port = process.env.PORT || 8000;
const server = http.createServer(app);
const io = socketio(server);

// Middlewares
// const { createTicket, joinTicket, sendAgentName, updateTickets } = require('./middlewares/ticket');
// const { saveChat, getChat } = require('./middlewares/chat');

io.on('connection', socket => {
	console.log('New WS connection')

	socket.on('join-ticket', ({roomId, user}) => {
		// console.log(roomId);
		socket.join(roomId); // User join into the room
		// console.log(typeof roomId)
		io.to(roomId).emit('server-message', `${user} connected into the server`);
	});

	socket.on('user-message', ({roomId, msg}) => {
		io.to(roomId).emit('user-message', msg);
	});

	socket.on('agent-message', ({roomId, msg}) => {
		// console.log(roomId, msg);
		io.to(roomId).emit('agent-message', msg);
	});
});

server.listen(port, () => console.log(`Server start at Port ${port}`));