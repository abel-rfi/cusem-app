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
	try {
		const { emplId } = VerifyToken(req.query.id);
		employees.findAll({ raw: true, where: { roles: "agent" } })
			.then(emplo => {
				emplo.map((empl, i) => {
					emplo[i].agentId = req.query.id;
					emplo[i].ticket = req.query.ticket;
				});
				res.render('agentListPage', {
					emplo, layout: 'agentLsPg', query: { query: req.query }
				});
			});
	}
	catch (err) {
		res.redirect('/employee-login-page');
	}

};

const search = (req, res) => {
	let { term } = req.body;

	// Make lowercase
	term = term.toLowerCase();
	try {
		const { emplId } = VerifyToken(req.query.id);
		employees.findAll({ raw: true, where: { name: { [Op.like]: '%' + term + '%' }, roles: "agent" } })
			.then(emplo => {
				emplo.map((empl, i) => {
					emplo[i].agentId = req.query.id;
					emplo[i].ticket = req.query.ticket;
				});
				res.render('agentListPage', {
					emplo, layout: 'agentLsPg', query: { query: req.query }
				});
			});
	}
	catch (err) {
		res.redirect('/employee-login-page');
	}
};

const open = async (req, res) => {
	try {
		const { emplId } = VerifyToken(req.query.id);
		const emplo = await employees.findAll({
			raw: true,
			where: {
				id: req.params.id
			}
		});
		emplo[0].password = cryptr.decrypt(emplo[0].password);
		emplo.map((empl, i) => {
			emplo[i].agentId = req.query.id;
			emplo[i].ticket = req.query.ticket;
		});
		res.render('editAgent', { emplo, layout: 'editAgentLayout', query: { query: req.query } });
	} catch (err) {
		res.redirect('/employee-login-page');
	}
}

const update = async (req, res) => {
	try {
		const { emplId } = VerifyToken(req.query.id);
		let doneT = [{
			text: "Agent Updated"
		}]
		const encryptedString = cryptr.encrypt(req.body.password);
		await employees.update({
			name: req.body.name,
			email: req.body.email,
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
		emplo.map((empl, i) => {
			emplo[i].agentId = req.query.id;
			emplo[i].ticket = req.query.ticket;
		});
		res.render('editAgent', { emplo, doneT, layout: 'editAgentLayout', query: { query: req.query } });
	} catch (err) {
		res.redirect('/employee-login-page');
	}
}

const deleteAgent = async (req, res) => {
	const { emplId } = VerifyToken(req.query.id);
	agentId = req.query.id;
	ticket = req.query.ticket;
	await employees.destroy({
		where: {
			id: req.params.id
		}
	})
		.then(result => {
			res.json({ redirect: `/agent-list-page?id=${agentId}&token=${ticket}` })
		})
		.catch(err => {
			res.redirect('/employee-login-page');
		});
}

const create = async (req, res) => {
	try {
		const { emplId } = VerifyToken(req.query.id);
		agentId = req.query.id;
		ticket = req.query.ticket;
		res.render('createAgent', { agentId, ticket, layout: 'editAgentLayout', query: { query: req.query } });
	} catch (err) {
		res.redirect('/employee-login-page');
	}
}

const createAgent = async (req, res) => {

	try {
		const { emplId } = VerifyToken(req.query.id);
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
		emplo.map((empl, i) => {
			emplo[i].agentId = req.query.id;
			emplo[i].ticket = req.query.ticket;
		});
		if (emplo.length == true) {
			res.render('createAgent', { agentId, ticket, errorT, layout: 'editAgentLayout', query: { query: req.query } });

		} else {
			const encryptedString = cryptr.encrypt(req.body.password);
			await employees.create({
				name: req.body.name,
				email: req.body.email,
				password: encryptedString,
				roles: 'agent',
				phone: req.body.phone,
				address: req.body.address
			});
			res.redirect(`/agent-list-page?id=${agentId}&token=${ticket}`);
		}
	} catch (err) {
		res.redirect('/employee-login-page');
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
