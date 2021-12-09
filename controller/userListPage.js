const models = require('../models');
const users = models.User;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Cryptr = require('cryptr');
const cryptr = new Cryptr('cusem_super_key');

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
	users.findAll({ raw: true })
		.then(usere => res.render('userListPage', {
			usere, layout: 'userLsPg'
		}))
		.catch(err => res.json({
			"message": err
		}));
}

const search = (req, res) => {
	let { term } = req.query;

	// Make lowercase
	term = term.toLowerCase();

	users.findAll({ raw: true, where: { name: { [Op.like]: '%' + term + '%' } } })
		.then(usere => res.render('userListPage', { usere, layout: 'userLsPg' }))
		.catch(err => res.json({
			"message": err
		}));
};

const open = async (req, res) => {
	try {
		const usere = await users.findAll({
			raw: true,
			where: {
				id: req.params.id
			}
		});
		usere[0].password = cryptr.decrypt(usere[0].password);

		res.render('editUser', { usere, layout: 'editUserLayout' });
	} catch (err) {
		console.log(err);
	}
}

const update = async (req, res) => {
	try {
		let doneT = [{
			text: "User Updated"
		}]
		const encryptedString = cryptr.encrypt(req.body.password);
		await users.update({
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
		
		const usere = await users.findAll({
			raw: true,
			where: {
				id: req.params.id
			}
		});
		usere[0].password = cryptr.decrypt(usere[0].password);
		res.render('editUser', { usere, doneT, layout: 'editUserLayout' });
	} catch (err) {
		console.log(err);
	}
}

const deleteUser = async (req, res) => {

	await users.destroy({
		where: {
			id: req.params.id
		}
	})
		.then(result => {
			res.json({ redirect: '/user-list-page' })
		})
		.catch(err => {
			console.log(err)
		});
}

const create = async (req, res) => {
	try {
		res.render('createUser', { layout: 'editUserLayout' });
	} catch (err) {
		console.log(err);
	}
}

const createUser = async (req, res) => {

	try {
		let errorT = [{
			text: "the user with the email already exists"
		}]
		const usere = await users.findAll({
			raw: true,
			where: {
				email: req.body.email,
			}
		});
		
		if (usere.length == true) {
			res.render('createuser', { errorT, layout: 'editUserLayout' });
			
		} else {
			const encryptedString = cryptr.encrypt(req.body.password);
			await users.create({
				name: req.body.name,
				email: req.body.email, 
				password:encryptedString, 
				phone:req.body.phone,
				address:req.body.address
			});
			res.redirect('/user-list-page');
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
	deleteUser,
	create,
	createUser
}
