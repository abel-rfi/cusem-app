const Op = require('sequelize').Op;

// Untuk debuggin pertama create token utk roomName dlu, stlah itu baru di paste disini
let tickets = [{
    custId: 5,
    emplId: 1,
    complaintStatus: 'open',
    complaintCategory: 'complaint',
    passedFor: 0,
    passedFrom: null,
    roomName: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0SWQiOjUsImlhdCI6MTYzODY5MzYxOCwiZXhwIjoxNjQxMjg1NjE4fQ.6xGCA_z4TSGGSUDx91rIEU3V-7LRlWdd6_3m5lIW0g0'
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
		complaintCategory: category,
		complaintStatus: 'open',
		passedFor: 0,
		passedFrom: null,
		roomName: CreateToken({custId}, '50d')
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
				if (tickets[i].complaintStatus === "open"){
					// console.log(tickets[i].complaintStatus)
					tickets[i].complaintStatus= "on Progress";
				}
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

function fetchTicket() {
	try {
		fetchAll(models.Ticket, { complaintStatus: {
			[Op.or]: ["open", "on Hold", "on Progress"]
		}}).then(result => {
			tickets.map((tckt, i) => {
				result.map((tkt, i) => {
					if (tckt.custId === tkt.custId && tckt.roomName === tkt.roomName) {
						tickets[i] = tkt;
					} else {
						tickets.push(tkt);
						delete result[i]
					}
				})
			})
		})
		// console.log(tickets);
	} catch(err) {
		console.log(err)
	}
}

function sendAgentName(socket, id) {
	try{
		fetchOne(models.Employee, {id, roles:'agent'})
		.then(result => {
			// console.log(result.name);
			socket.broadcast.emit('agent-accept', {name: result.name});
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