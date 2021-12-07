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
		update(models.Ticket, {complaintStatus}, {emplId, roomName});
	} catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const render = (req, res) => {
	try {
		const condition = {complaintStatus: {
			[Op.or]: ['open', 'on Hold', 'on Progress']
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
			return res.render('agentDashboard', {layout: 'agentDashboard', sum:{sum:{sum}}, result});
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
			return res.render('agentDashboardTA', {layout: 'agentDashboard', result});
		})
	} catch(err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const renderLc = (req, res) => {
	try {
		const condition = {emplId: 1, complaintStatus: {
			[Op.or]: ['open', 'on Hold', 'on Progress']
		}};
		models.Ticket.findAll({raw: true, where: condition, include: [
			{
				model: models.User,
				as: 'user'
			}
		]})
		.then(allTickets => {
			// console.log(allTickets)
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
						return res.render('agentDashboardLC', {result:{result}, accepted: allTickets, layout: 'agentDashboardLC'});
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
				return res.render('agentDashboardLC', {layout: 'agentDashboardLC', accepted: allTickets});
			}
		})
	} catch (err) {
		console.log(`msg: ${err.message} ~ renderLc`);
		return res.status(500).json({msg: err.message});
	}
}

const renderCS = (req, res) => {
	try {
		const condition = {emplId: 1, complaintStatus: {
			[Op.or]: ['open', 'on Hold', 'on Progress']
		}};
		models.Ticket.findAll({raw: true, where: condition, include: [
			{
				model: models.User,
				as: 'user'
			}
		]})
		.then(allTickets => {
			try {
				const condition = {complaintStatus: 'open'};

				models.Ticket.findAll({raw: true, where:condition, include: [
					{
						model: models.User,
						as: 'user'
					}
				]}).then(result => {
					return res.render('agentDashboardLCCS', {result, accepted: allTickets, layout: 'agentDashboardLC'});
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
		const {id} = req.query;
		const condition = {emplId: id, complaintStatus: {
			[Op.or]: ['open', 'on Hold', 'on Progress']
		}};
		models.Ticket.findAll({raw: true, where: condition, include: [
			{
				model: models.User,
				as: 'user'
			}
		]}).then(allTickets => {
			const condition = {passedFrom: id, complaintStatus: {
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
				console.log(result);
				res.render('agentDashboardLCFS1', {accepted: allTickets, result, layout: 'agentDashboardLC'});
			});
		})
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const renderFS2 = (req, res) => {
	try {
		const {ticket} = req.query;
		const condition = {emplId: 1, complaintStatus: {
			[Op.or]: ['open', 'on Hold', 'on Progress']
		}};
		models.Ticket.findAll({raw: true, where: condition, include: [
			{
				model: models.User,
				as: 'user'
			}
		]}).then(allTickets => {
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
				res.render('agentDashboardLCFS2', {layout: 'agentDashboardLC', accepted: allTickets, result, selected:selected});
			})
	})} catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

module.exports = {
	test,
	changeStatus,
	render,
	renderTA,
	renderLc,
	renderCS,
	renderFS1,
	renderFS2
}