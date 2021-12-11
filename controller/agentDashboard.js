const Op = require('sequelize').Op;

const models = require('../models');

// Middlewares
const { fetchAll } = require('../middlewares/CRUD');

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

const renderLc = (req, res) => {
	try {
		res.render('agentDashboardLC', {layout: 'agentDashboardLC'});
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const renderCS = (req, res) => {
	try {
		fetchAll(models.Ticket, {complaintStatus: {
			[Op.or]: ['open', 'on Hold', 'on Progress']
		}})
		.then(tickets => {
			fetchAll(models.User)
			.then(users => {
				const data = [];
				tickets.map(tckt => {
					users.map(usr => {
						if (tckt.custId === usr.id) {
							data.push({
								day: tckt.createdAt.getDate(),
								month: tckt.createdAt.getMonth(),
								year: tckt.createdAt.getFullYear(),
								hours: tckt.createdAt.getHours(),
								minutes: tckt.createdAt.getMinutes(),
								name: usr.name,
								complaintStatus: tckt.complaintStatus,
								complaintCategory: tckt.complaintCategory,
								roomName: tckt.roomName
							})
						}
					})
				})
				// console.log(data);
				return res.render('agentDashboardLCCS', {tckts: data, layout: 'agentDashboardLC'});
			})			
		});
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const renderFS1 = (req, res) => {
	try {
		res.render('agentDashboardLCFS1', {layout: 'agentDashboardLC'});
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const renderFS2 = (req, res) => {
	try {
		res.render('agentDashboardLCFS2', {layout: 'agentDashboardLC'});
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

/*start of agent email side (hopefully)
first hypo is that it'd look more intuitive for email to be under agentDashboard
*/


module.exports = {
	test,
	renderLc,
	renderCS,
	renderFS1,
	renderFS2
}