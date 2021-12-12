const http = require('http');
const socketio = require('socket.io');

const app = require('./app');

// Create http server
const port = process.env.PORT || 8000;
const server = http.createServer(app);
const io = socketio(server);

// Middlewares
const { createTicket, joinTicket, fetchTicket, sendAgentName } = require('./middlewares/ticket');
const { saveChat, getChat } = require('./middlewares/chat');

io.on('connection', socket => {
	console.log('New WS connection')

	socket.on('joinTicket', ({id, ticket, role}) => {
		fetchTicket();
		try {
			getChat(socket, io, ticket, role);
			const data = joinTicket(socket, {id, ticket, role});
			if ("success" in data && !data.success) {
				// console.log()
				socket.emit('session-expired', 'delete session');
			} else {
				socket.join(data.roomName);
				
				if (role === "agent") {
					sendAgentName(socket, data.emplId);
				}
			}
			// fetchTicket()
		} catch(err) {
			console.log(err);
			fetchTicket();
		}
		// fetchTicket();
	})

	socket.on('createTicket', ({token, category}) => {
		const data = createTicket({token, category});		
		// console.log(data.roomName)
		socket.join(data.roomName);

		// Test joinned user
		socket.emit('message', 'Welcome to live chat');
		socket.emit('ticket-session', data.roomName);

		fetchTicket()
	})

	socket.on('disconnect', () => {
		io.emit('message', 'A user has left the chat');
	});

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