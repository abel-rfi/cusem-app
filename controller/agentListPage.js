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
		res.json({ redirect: '/agent-list-page'})
	})
	.catch(err => {
		console.log(err)
	});
}

module.exports = {
	test,
	render,
	search,
	open,
	update,
	deleteAgent
}