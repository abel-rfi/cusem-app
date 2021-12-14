const models = require('../models');
const emails = models.Form;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Cryptr = require('cryptr');
const cryptr = new Cryptr('cusem_super_key');

// Middlewares
const { update, fetchAll, fetchOne } = require('../middlewares/CRUD');
const { VerifyToken } = require('../middlewares/auth');
const e = require('express');

/*
// below is effort to render nav bar. error so far: SequelizeEagerLoadingError
const render = (req, res) => {

	// trying to render nav bar by verifying first
	const {emplId} = VerifyToken(req.query.id);

	const condition = {emplId, complaintStatus: {
		[Op.or]: ['open', 'On Progress']
	}};

	emails.findAll({ raw: true , where: condition, include: [
		{
			model: models.Form
		}
	]})
		.then(email => res.render(
			'agentDashboardEmail', {
			email, 
			layout: 'openEmail',
			query: {query: req.query}
		}))
		.catch(err => res.json({
			"message": err
		}));
}
*/

// render infant ver
const render = (req, res) => {

	emails.findAll({ raw: true })
		.then(email => res.render(
			'agentDashboardEmail', {
			email, 
			layout: 'agentEmail'
			//query: {query: req.query}
		}))
		.catch(err => res.json({
			"message": err
		}));
}

const openEmail = async (req, res) => {
	try {
		const email = await emails.findAll({
			raw : true,
			where : {
				id: req.params.id
			}
		});
		//email[0].password = crypt.decrypt(email[0].password);

		res.render('agentDashboardEmailOpen', {
			email,
			layout: 'agentEmail'
		});
	} catch (err) {
		console.log(err);
	}
}


const replyEmail = async (req, res) => {
	// totally not done im tired
	try {
		const email = await emails.findAll({
			raw : true,
			where : {
				id: req.params.id
			}
		});
		//email[0].password = crypt.decrypt(email[0].password);

		res.render('agentDashboardEmailReply', {
			email,
			layout: 'agentEmail'
		});
	} catch (err) {
		console.log(err);
	}
}



module.exports = {
	render,
	openEmail,
	replyEmail
}

