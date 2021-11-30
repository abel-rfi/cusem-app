const models = require('../models');

// middlewares
const { create, fetchOne, fetchAll } = require('./CRUD');


function saveChat(roomName, msg, role) {
	try{
		fetchOne(models.Ticket, {roomName})
		.then(result => {
			const data = {
				ticketId: result.id,
				sender: role,
				message: msg
			}
			console.log(data);
			create(models.Chat, data);
		});
	} catch(err) {
		console.log("chat.js ~ saveChat", err)
	}
}

function getChat(socket, io, roomName, role) {
	try {
		fetchOne(models.Ticket, {roomName})
		.then(result => {
			fetchAll(models.Chat, {ticketId:result.id})
			.then(chats => {
				chats.map(chat => {
					if (chat.sender == 'user'){
						io.to(socket.id).emit('user-message', chat.message);
					} else if (chat.sender == 'agent') {
						io.to(socket.id).emit('agent-message', chat.message);
					} else {
						console.log("ERROR =", chat);
					}
				})
			})
		});
	} catch(err) {
		console.log("chat.js ~ getChat", err)
	}
}

module.exports = {
	saveChat,
	getChat
}