const Op = require('sequelize').Op;

const models = require('../models');

// middlewares
const { VerifyToken, CreateToken } = require('./auth');
const { create, fetchOne, update, fetchAll } = require('./CRUD');

// stored variable
let tickets;

fetchAll(models.Ticket, {})
.then(result => {
	tickets = result;
})

function joinTicket(socket, io, {id, ticket, role}) {
	try{
		models.Ticket.findAll({raw: true})
		.then(tickets => {
			const verifiedId = VerifyToken(id);
			const checkSession = VerifyToken(ticket);
			if (role === 'user') {
				const data = tickets.filter(tkt => tkt.roomName === ticket & tkt.custId === verifiedId.userId)[0];
				enterRoom(socket, io, {...data, success: true});
			} else if (role === 'agent') {
				const data = tickets.filter((tkt, i) => {
					if (tkt.roomName === ticket) {
						tickets[i].emplId = verifiedId.emplId;
						if (tickets[i].complaintStatus === "open") {
							tickets[i].complaintStatus = "on Progress";
						}
						return tkt;
					}
				})[0];
				try {
					update(models.Ticket, data, {roomName: data.roomName, custId: data.custId});
					enterRoom(socket, io, {...data, success: true});
					sendAgentName(socket, data.emplId);
				} catch(err) {
					console.log(err, '~ ticket.js - joinTicket (Agent)');
					enterRoom(socket, io, {success: false});
				}
			}
		})
	} catch(err) {
		console.log(err, '~ ticket.js - joinTicket ');
		enterRoom(socket, io, {success: false});
	}
}

function enterRoom(socket, io, data) {
	if (data.success) {
		socket.join(data.roomName);
	} else {
		io.to(socket.id).emit('session-expired', 'delete session');
		console.log('session expired');
	}
}

function createTicket({id, category}) {
	const verifiedId = VerifyToken(id);
	const data = {
		custId: verifiedId.userId,
		emplId: null,
		complaintCategory: category,
		complaintStatus: 'open',
		passedFor: 0,
		passedFrom: null,
		roomName: CreateToken({custId: verifiedId.userId}, '50d'),
		ticketType: 'live chat'
	};
	try{
		tickets.push(data);
		create(models.Ticket, data);
		return {success: true, ...data};
	} catch(err) {
		console.log(err, '~ ticket.js - createTicket');
		return {success: false};
	}
}

function sendAgentName(socket, id) {
	try{
		fetchOne(models.Employee, {id: id, roles:'agent'})
		.then(result => {
			socket.broadcast.emit('agent-accept', {name: result.name});
		})
	} catch(err) {
		console.log("tickets.js ~ sendAgentName", err);
	}
}

function updateTickets() {
	fetchAll(models.Ticket, {})
	.then(result => {
		tickets = result;
	})
}

module.exports = {
	joinTicket,
	createTicket,
	sendAgentName,
	updateTickets
}