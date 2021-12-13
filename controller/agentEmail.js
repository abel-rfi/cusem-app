const models = require('../models');
const emails = models.Form;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Cryptr = require('cryptr');
const cryptr = new Cryptr('cusem_super_key');

const render = (req, res) => {
	emails.findAll({ raw: true })
		.then(email => res.render('agentDashboardEmail', {
			email, layout: 'openEmail'
		}))
		.catch(err => res.json({
			"message": err
		}));
}


const open = async (req, res) => {
	try {
		const email = await emails.findAll({
			raw: true,
			where: {
				id: req.params.id
			}
		});
		res.render('showEmail', { email, layout: 'openEmail' });
	} catch (err) {
		console.log(err);
	}
}


/*
const update = async (req, res) => {
	try {
		let doneT = [{
			text: "Agent Updated"
		}]
		await employees.update(req.body, {
			where: {
				id: req.params.id
			}
		});
		const emplo = await employees.findAll({
			raw: true,
			where: {
				id: req.params.id
			}
		});
		res.render('editAgent', { emplo, doneT, layout: 'editAgentLayout' });
	} catch (err) {
		console.log(err);
	}
}

const deleteAgent = async (req, res) => {

	await employees.destroy({
		where: {
			id: req.params.id
		}
	})
	.then(result => {
		res.json({ redirect: '/agent-list-page'})
	})
	.catch(err => {
		console.log(err)
	});
}

const create = async (req, res) => {
	try {
		res.render('createAgent', { layout: 'editAgentLayout' });
	} catch (err) {
		console.log(err);
	}
}

const createAgent = async (req, res) => {
	try {
		await employees.create(req.body);
		res.redirect('/agent-list-page');
	} catch (err) {
		console.log(err);
	}
}
*/
module.exports = {
	render,
	//search,
	open,
	/*
	update,
	deleteAgent,
	create,
	createAgent
	*/
}
