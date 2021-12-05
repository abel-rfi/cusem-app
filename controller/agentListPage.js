const models = require('../models');
const employees = models.Employee;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const test = (req, res) => {
	try {
		res.send("Send Login");
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({ msg: err.message });
	}
}

const render = (req, res) => {
	employees.findAll({ raw: true, where: { roles: "agent" } })
		.then(emplo => res.render('agentListPage', {
			emplo, layout: 'agentLsPg'
		}))
		.catch(err => res.json({
			"message": err
		}));
}

const search = (req, res) => {
	let { term } = req.query;

	// Make lowercase
	term = term.toLowerCase();

	employees.findAll({ raw: true, where: { name: { [Op.like]: '%' + term + '%' }, roles: "agent" } })
		.then(emplo => res.render('agentListPage', { emplo, layout: 'agentLsPg' }))
		.catch(err => res.json({
			"message": err
		}));
};

const open = async (req, res) => {
	try {
		const emplo = await employees.findAll({
			raw: true,
			where: {
				id: req.params.id
			}
		});
		res.render('editAgent', { emplo, layout: 'editAgentLayout' });
	} catch (err) {
		console.log(err);
	}
}

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
			res.json({ redirect: '/agent-list-page' })
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
		let errorT = [{
			text: "the agent with the email already exists"
		}]
		const emplo = await employees.findAll({
			raw: true,
			where: {
				email: req.body.email,
				roles: "agent"
			}
		});
		if (emplo.length == true) {
			res.render('createAgent', { errorT, layout: 'editAgentLayout' });
			
		} else {
			await employees.create({
				name: req.body.name,
				email: req.body.email, 
				password:req.body.password, 
				roles: 'agent',
				phone:req.body.phone,
				address:req.body.address
			});
			res.redirect('/agent-list-page');
		}
	} catch (err) {
		console.log(err);
	}
}
module.exports = {
	test,
	render,
	search,
	open,
	update,
	deleteAgent,
	create,
	createAgent
}
