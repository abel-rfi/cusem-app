const models = require('../models');
const users = models.User;
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
		users.findAll({ raw: true })
			.then(usere => {
				usere.map((empl, i) => {
					usere[i].agentId = req.query.id;
					usere[i].ticket = req.query.ticket;
				});
				res.render('userListPage', {
					usere, layout: 'userLsPg', query: { query: req.query }
				});
			});
	}
	catch (err) {
		res.redirect('/employee-login-page');
	}

}

const search = (req, res) => {
	let { term } = req.body;
	
	// Make lowercase
	term = term.toLowerCase();
	try {
		const { emplId } = VerifyToken(req.query.id);
		users.findAll({ raw: true, where: { name: { [Op.like]: '%' + term + '%' } } })
			.then(usere => {
				usere.map((empl, i) => {
					usere[i].agentId = req.query.id;
					usere[i].ticket = req.query.ticket;
				});
				res.render('userListPage', {
					usere, layout: 'userLsPg', query: { query: req.query }
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
		const usere = await users.findAll({
			raw: true,
			where: {
				id: req.params.id
			}
		});
		usere[0].password = cryptr.decrypt(usere[0].password);
		usere.map((empl, i) => {
			usere[i].agentId = req.query.id;
			usere[i].ticket = req.query.ticket;
		});
		res.render('editUser', { usere, layout: 'editUserLayout', query: { query: req.query } });
	} catch (err) {
		res.redirect('/employee-login-page');
	}
}

const update = async (req, res) => {
	try {
		const { emplId } = VerifyToken(req.query.id);
		let doneT = [{
			text: "User Updated"
		}]
		const encryptedString = cryptr.encrypt(req.body.password);
		await users.update({
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

		const usere = await users.findAll({
			raw: true,
			where: {
				id: req.params.id
			}
		});
		usere[0].password = cryptr.decrypt(usere[0].password);
		usere.map((empl, i) => {
			usere[i].agentId = req.query.id;
			usere[i].ticket = req.query.ticket;
		});
		res.render('editUser', { usere, doneT, layout: 'editUserLayout', query: { query: req.query } });
	} catch (err) {
		res.redirect('/employee-login-page');
	}
}

const deleteUser = async (req, res) => {
	const { emplId } = VerifyToken(req.query.id);
	agentId = req.query.id;
	ticket = req.query.ticket;
	await users.destroy({
		where: {
			id: req.params.id
		}
	})
		.then(result => {
			res.json({ redirect: `/user-list-page?id=${agentId}&token=${ticket}` })
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
		res.render('createUser', { agentId, ticket, layout: 'editUserLayout', query: { query: req.query } });
	} catch (err) {
		res.redirect('/employee-login-page');
	}
}

const createUser = async (req, res) => {

	try {
		const { emplId } = VerifyToken(req.query.id);
		let errorT = [{
			text: "the user with the email already exists"
		}]
		const usere = await users.findAll({
			raw: true,
			where: {
				email: req.body.email,
			}
		});
		usere.map((empl, i) => {
			usere[i].agentId = req.query.id;
			usere[i].ticket = req.query.ticket;
		});
		if (usere.length == true) {
			res.render('createuser', { agentId, ticket, errorT, layout: 'editUserLayout', query: { query: req.query } });

		} else {
			const encryptedString = cryptr.encrypt(req.body.password);
			await users.create({
				name: req.body.name,
				email: req.body.email,
				password: encryptedString,
				phone: req.body.phone,
				address: req.body.address
			});
			res.redirect(`/user-list-page?id=${agentId}&token=${ticket}`);
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
	deleteUser,
	create,
	createUser
}
