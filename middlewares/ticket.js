const Op = require('sequelize').Op;

// Untuk debuggin pertama create token utk roomName dlu, stlah itu baru di paste disini
let tickets = [{
    custId: 5,
    emplId: 1,
    complaintStatus: 'on Progress',
    complaintCategory: 'complaint',
    passedFor: 0,
    passedFrom: null,
    roomName: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0SWQiOjUsImlhdCI6MTYzODIwMzA2MSwiZXhwIjoxNjM4MjA2NjYxfQ.6NBkXl75yU4G5fn7iEjivefaPMX9dMw34fMpnYcLkLQ'
  }];

const models = require('../models');

// middlewares
const { VerifyToken, CreateToken } = require('./auth');
const { create, fetchOne, update, fetchAll } = require('./CRUD');

function createTicket ({token, category}) {
	custId = VerifyToken(token).userId;
	const data = {
		custId,
		emplId: null,
		complaintStatus: "open",
		complaintCategory: category,
		passedFor: 0,
		passedFrom: null,
		roomName: CreateToken({custId}, '1h')
	}
	tickets.push(data);
	console.log(data, "create");
	create(models.Ticket, data);
	return data;
}

function joinTicket(socket, {id, ticket, role}) {
	if (role == 'user') {
		custId = VerifyToken(id).userId;
		try {
			// console.log(tickets);
			// check if the ticket session is expired
			checkExpire = VerifyToken(ticket);

			return tickets.filter(tckt => tckt.roomName === ticket)[0]
		} catch (err) {
			console.log('session expired');
			return {success: false}
		}
	} else if (role == 'agent') {
		tickets.map((tckt, i) => {
			if (tckt.roomName === ticket) {
				tickets[i].emplId = parseInt(id);
				tickets[i].complaintStatus= "on Progress";
			}
		});
		// console.log(tickets);
		const data = tickets.filter(tckt => tckt.roomName === ticket)[0]
		
		// console.log(data, tickets)
		// update to db
		try{
				update(models.Ticket, data, {custId:data.custId, roomName: data.roomName});
				return data
			} catch (err) {
				console.log(err)
			}
	} else {
		console.log('status 500')
	}
}

async function fetchTicket(){
	try{
		fetchTickets = await fetchAll(models.Ticket, { complaintStatus: {
			[Op.or]: ["open", "on Hold", "on Progress"]
		}});
		
		tickets.map((tckt, i) => {
			fetchTickets.map((tkt, j) => {
				if (tckt.custId === tkt.custId && tckt.complaintStatus === tkt.complaintStatus && tckt.roomName === tkt.roomName) {
					tickets[i] = tkt
				} else {
					tickets.push(tkt);
					delete fetchTickets[j]
				}
			})
		})

		// console.log(tickets);
		// return tickets;
	} catch(err) {
		console.log(err)
	}
}

function sendAgentName(socket, id) {
	try{
		fetchOne(models.Employee, {id, roles:'agent'})
		.then(result => {
			console.log(result.name);
			socket.emit('agent-accept', {name: result.name});
		})
	} catch(err) {
		console.log("tickets.js ~ sendAgentName", err);
	}
}

module.exports = {
	createTicket,
	joinTicket,
	fetchTicket,
	sendAgentName
}