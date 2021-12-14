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

	socket.on('joinTicket', (data) => {
		getChat(socket, io, data.ticket, data.role);
		joinTicket(socket, io, data);
	})

	socket.on('createTicket', (data) => {
		const result = createTicket(data);
		// console.log(result);
		socket.join(result.roomName);

		// updateTickets();
		io.in(result.roomName).emit('ticket-session', result.roomName);
	})

	socket.on('agent-message', ({ticket, msg}) => {
		saveChat(ticket, msg, 'agent');
		// console.log(ticket, msg);
		io.to(ticket).emit('agent-message', msg);
	});

	socket.on('user-message', ({ticketSession, msg}) => {
		// fetchTicket();
		saveChat(ticketSession, msg, 'user');
		// console.log("lel =", msg);
		io.to(ticketSession).emit('user-message', msg);
	});

	socket.on('close-session', ticket => {
		io.in(ticket).emit('close-session', ticket);
	})
});

server.listen(port, () => console.log(`Server start at Port ${port}`));