const Op = require('sequelize').Op;

const models = require('../models');
const employee = models.Employee;
const Ticket = models.Ticket;
const Chat = models.Chat;

// Function Section

exports.saveChat = async (req, res) => {
	try {
		const agent = employee.findOne({where: {id: "f70b1996-87d9-4212-bdae-064805d93387"}});

		const {roomId, msg} = req.body;

		let condition = {
			emplId:agent.id, 
			roomName: roomId, 
			ticketType: "Live Chat"
		};
		const ticket = await Ticket.findOne({raw: true, where: condition});

		const chat = {
			ticketId: ticket.id,
			sender: "user",
			message: msg
		};

		Chat.create(chat);
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
		return res.render('ticketArchieve', {layout: 'newAgentNav'});
	} catch(err) {
		console.log(`msg: ${err.message}`);
		// return res.redirect('/employee-login-page');
		return res.status(500).json({msg: err.message});
	}
}

exports.renderLC = async (req, res) => {
	try {
		const openTickets = await Ticket.findAll({where: {complaintStatus: "Open"}});
		const taken = await Ticket.findAll({where: {complaintStatus: "Taken", emplId: "f70b1996-87d9-4212-bdae-064805d93387"}});
		if (!req.params.id) {
			if (taken.length > 0) {
				return res.redirect(`/agent-dashboard/live-chat/${taken[0].id}`);
			}
		} else {
			const chats = await Chat.findAll({raw: true, where: {ticketId: req.params.id}});

			return res.render('agentLiveChat', {layout: 'newAgentNav', chats});
		}
	} catch(err) {
		console.log(`msg: ${err.message}`);
		// return res.redirect('/employee-login-page');
		return res.status(500).json({msg: err.message});
	}
}