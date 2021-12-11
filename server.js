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
		// const result = joinTicket(data);
		// console.log('join2', result);
		joinTicket(socket, io, data);
		/*
		if (result.success) {
			socket.join(result.roomName);

			if (data.role === "agent") {
				sendAgentName(socket, result.emplId);
			}
		} else {
			// io.in(ticket).emit('session-expired', 'delete session');
			console.log('session expired');
		}
		*/
	})

	socket.on('createTicket', (data) => {
		const result = createTicket(data);
		console.log(result);
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
});

server.listen(port, () => console.log(`Server start at Port ${port}`));