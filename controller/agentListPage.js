const models = require('../models');
const employees = models.Employee;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Cryptr = require('cryptr');
const cryptr = new Cryptr('cusem_super_key');

const { VerifyToken } = require('../middlewares/auth');

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
		const { emplId } = VerifyToken(req.params.id);
		const emplo = await employees.findAll({
			raw: true,
			where: {
				id: emplId
			}
		});
		emplo[0].password = cryptr.decrypt(emplo[0].password);
		
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
		const encryptedString = cryptr.encrypt(req.body.password);
		await employees.update({
			name: req.body.name,
			email:req.body.email,
			password: encryptedString,
			phone: req.body.phone,
			address: req.body.address
		}
			, {
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
		emplo[0].password = cryptr.decrypt(emplo[0].password);
		
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
			const encryptedString = cryptr.encrypt(req.body.password);
			await employees.create({
				name: req.body.name,
				email: req.body.email, 
				password:encryptedString, 
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
