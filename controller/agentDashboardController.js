const {Op} = require('sequelize');

const models = require('../models');
const employee = models.Employee;
const Ticket = models.Ticket;
const Chat = models.Chat;

// Function Section

exports.logout = async (req, res) => {
	try {
		res.cookie('agentToken', "");
		return res.redirect(`/employee-login-page`);
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

exports.saveChat = async (req, res) => {
	try {
		const { email, agentId:id } = req.body.decoded;
		const {room, msg} = req.body;

		let condition = {
			emplId:id, 
			roomName: room, 
			ticketType: "Live Chat"
		};
		const ticket = await Ticket.findOne({raw: true, where: condition});

		const chat = {
			ticketId: ticket.id,
			sender: "agent",
			message: msg
		};
		
		Chat.create(chat);
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

exports.getChat = async (req, res) => {
	try {
		const { id:ticketId } = req.query;
		const chats = await Chat.findAll({raw: true, where: {ticketId}, order: [['createdAt', 'ASC']]});
		return res.status(200).json(chats);
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

// Render Section

exports.render = async (req, res) => {
	try {
		return res.render('agentDashboard', {layout: 'newAgentNav'});
	} catch(err) {
		console.log(`msg: ${err.message}`);
		// return res.redirect('/employee-login-page');
		return res.status(500).json({msg: err.message});
	}
}

exports.renderTA = async (req, res) => {
	try {
		const { email, agentId:id } = req.body.decoded;
		const myAgent = await employee.findOne({raw:true, where: {email, id}});
		const Tickets = await Ticket.findAll({raw:true, include: [
			{
				model: models.User,
				as: 'user'
			}, {
				model: models.Employee,
				as: 'employee'
			}
		]});
		// console.log(Tickets);
		return res.render('ticketArchieve', {layout: 'newAgentNav', Tickets});
	} catch(err) {
		console.log(`msg: ${err.message}`);
		// return res.redirect('/employee-login-page');
		return res.status(500).json({msg: err.message});
	}
}

exports.renderLC = async (req, res) => {
	try {
		const { email, agentId:id } = req.body.decoded;
		const openTickets = await Ticket.findAll({where: {complaintStatus: "Open"}});
		const myAgent = await employee.findOne({raw:true, where: {email, id}});
		const taken = await Ticket.findAll({raw: true, where: {complaintStatus: "Taken", emplId: id}, include: [
			{
				model: models.User,
				as: 'user'
			}
		]});
		// console.log(taken);
		if (!req.params.id) {
			if (taken.length > 0) {
				return res.redirect(`/agent-dashboard/live-chat/${taken[0].id}`);
			} else {
				return res.render('agentLiveChat', {layout: 'newAgentNav', myAgent: [myAgent]});
			}
		} else {
			const chats = await Chat.findAll({raw: true, where: {ticketId: req.params.id}, order: [['createdAt', 'ASC']]});
			const current = await taken.filter(x => {
				if (x.id == req.params.id) {
					return x;
				}
			});
			const agents = await employee.findAll({raw: true, where: {roles: 'agent', id: {
				[Op.not]: id
			}}});

			// console.log(agents);
			return res.render('agentLiveChat', {layout: 'newAgentNav', chats, taken, agents, current, myAgent: [myAgent]});
		}
	} catch(err) {
		console.log(`msg: ${err.message}`);
		// return res.redirect('/employee-login-page');
		return res.status(500).json({msg: err.message});
	}
}