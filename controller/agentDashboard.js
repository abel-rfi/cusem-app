const Op = require('sequelize').Op;

const models = require('../models');

// Middlewares
const { update, fetchAll, fetchOne } = require('../middlewares/CRUD');
const { VerifyToken } = require('../middlewares/auth');

const test = (req, res) => {
	try {
		res.send("Test");
		console.log('test')
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const changeStatus = (req, res) => {
	try {
		const { emplId, roomName, complaintStatus } = req.body;
		update(models.Ticket, {complaintStatus}, {emplId: VerifyToken(emplId).emplId, roomName});
	} catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const forwardTicket = (req, res) => {
	try {
		const {emplId} = VerifyToken(req.body.emplId);
		const { roomName } = req.body;
		const newData = {
			emplId: null,
			passedFrom: emplId
		}
		update(models.Ticket, newData, {emplId, roomName})
		// res.redirect(`/agent-dashboard/live-chat?id=${req.body.emplId}`);
	} catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const render = (req, res) => {
	try {
		const {emplId} = VerifyToken(req.query.id);
		// console.log(emplId)
		const condition = {emplId, ticketType: 'live chat', complaintStatus: {
			[Op.or]: ['on Hold', 'on Progress']
		}};

		models.Ticket.findAll({raw: true, where: condition, include: [
			{
				model: models.User,
				as: 'user'
			}
		]})
		.then(result => {
			const sum = result.length;
			// console.log(result, sum)
			return res.render('agentDashboard', {layout: 'agentDashboard', query: {query: req.query}, sum:{sum:{sum}}, result});
		})		
	} catch(err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const renderTA = (req, res) => {
	try {
		models.Ticket.findAll({raw: true, include: [
			{
				model: models.User,
				as: 'user'
			}, {
				model: models.Employee,
				as: 'employee'
			}
		]})
		.then(result => {
			// console.log(result);
			return res.render('agentDashboardTA', {layout: 'agentDashboard', query: {query: req.query}, result});
		})
	} catch(err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const renderLc = (req, res) => {
	try {
		const { emplId } = VerifyToken(req.query.id);
		const condition = {emplId, complaintStatus: {
			[Op.or]: ['on Hold', 'on Progress']
		}};
		models.Ticket.findAll({raw: true, where: condition, include: [
			{
				model: models.User,
				as: 'user'
			}
		]})
		.then(allTickets => {
			allTickets.map((tkt, i) => {
				allTickets[i].newEmplId = req.query.id;
			})
			const { ticket } = req.query;
			if (ticket){
				const ticketAll = fetchAll(models.Ticket)
				try {
					const { custId } = VerifyToken(ticket);
					models.Ticket.findOne({where: {custId, roomName: ticket}, raw: true, include: [
						{
							model: models.User,
							as: 'user'
						}
					]}).then(result => {
						return res.render('agentDashboardLC', {result:{result: {...result, newEmplId: req.query.id}}, query: {query: req.query}, accepted: allTickets, layout: 'agentDashboardLC'});
					});
				} catch(err) {
					const {id:emplId, ticket:roomName} = req.query;
					// console.log(emplId, roomName)
					models.Ticket.update({complaintStatus: 'Expired'}, {where: {emplId, roomName}})
					.then(result => {
						// console.log(result);
						return res.redirect('back');	
						// return res.send('error');
					})
				}
			} else {
				return res.render('agentDashboardLC', {layout: 'agentDashboardLC', query: {query: req.query}, accepted: allTickets});
			}
		})
	} catch (err) {
		console.log(`msg: ${err.message} ~ renderLc`);
		return res.status(500).json({msg: err.message});
	}
}

const renderCS = (req, res) => {
	try {
		const { emplId } = VerifyToken(req.query.id);
		const condition = {emplId, complaintStatus: {
			[Op.or]: ['on Hold', 'on Progress']
		}};
		models.Ticket.findAll({raw: true, where: condition, include: [
			{
				model: models.User,
				as: 'user'
			}
		]})
		.then(allTickets => {
			allTickets.map((tkt, i) => {
				allTickets[i].newEmplId = req.query.id;
			})
			try {
				const condition = {complaintStatus: 'open'};

				models.Ticket.findAll({raw: true, where:condition, include: [
					{
						model: models.User,
						as: 'user'
					}
				]}).then(result => {
					result.map((tkt, i) => {
						result[i].currentId = req.query.id;
					})
					// console.log(result);
					return res.render('agentDashboardLCCS', {result, query: {query: req.query}, accepted: allTickets, layout: 'agentDashboardLC'});
				})
			} catch(err) {
				console.log(`msg: ${err.message} ~LCCS`);
			}
		})
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const renderFS1 = (req, res) => {
	try {
		const { emplId } = VerifyToken(req.query.id);
		const condition = {emplId, complaintStatus: {
			[Op.or]: ['on Hold', 'on Progress']
		}};
		models.Ticket.findAll({raw: true, where: condition, include: [
			{
				model: models.User,
				as: 'user'
			}
		]}).then(allTickets => {
			// console.log(allTickets)
			allTickets.map((tkt, i) => {
				allTickets[i].newEmplId = req.query.id;
			})
			const condition = {passedFrom: emplId, complaintStatus: {
				[Op.or]: ['open', 'on Hold', 'on Progress']
			}};
			models.Ticket.findAll({raw: true, where: condition, include: [
				{
					model: models.User,
					as: 'user'
				}, {
					model: models.Employee,
					as: 'employee'
				}
			]}).then(result => {
				// console.log(result);
				res.render('agentDashboardLCFS1', {accepted: allTickets, query: {query: req.query}, result, layout: 'agentDashboardLC'});
			});
		})
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message, position: 'LCFS1'});
	}
}

const renderFS2 = (req, res) => {
	try {
		const { emplId } = VerifyToken(req.query.id);
		const {ticket} = req.query;
		const condition = {emplId, complaintStatus: {
			[Op.or]: ['on Hold', 'on Progress']
		}};
		models.Ticket.findAll({raw: true, where: condition, include: [
			{
				model: models.User,
				as: 'user'
			}
		]}).then(allTickets => {
			allTickets.map((tkt, i) => {
				allTickets[i].newEmplId = req.query.id;
			})
			fetchAll(models.Employee, {roles: 'agent', id: {
				[Op.not]: 1
			}}).then(result => {
				// console.log(result)
				let selected = allTickets.filter(tckt => {
					if (tckt.roomName === ticket) {
						return tckt;
					}
				})
				// console.log(selected);
				res.render('agentDashboardLCFS2', {layout: 'agentDashboardLC', query: {query: req.query}, accepted: allTickets, result, selected:selected});
			})
	})} catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message, position: 'LCFS2'});
	}
}

/*start of agent email side (hopefully)
first hypo is that it'd look more intuitive for email to be under agentDashboard
*/


module.exports = {
	test,
	changeStatus,
	forwardTicket,
	render,
	renderTA,
	renderLc,
	renderCS,
	renderFS1,
	renderFS2
}