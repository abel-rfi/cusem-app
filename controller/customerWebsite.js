const nodemailer = require("nodemailer");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('cusem_super_key');

// Middlewares
const {fetchAll, fetchOne, create} = require('../middlewares/CRUD');
const { VerifyToken, CreateToken } = require('../middlewares/auth');

const models = require('../models');
const { getMaxListeners } = require('../app');

const User = models.User;

const test = async (req, res) => {
	try {
		const user = await fetchAll(User, {});
		console.log(user);
		return res.status(200).json(user);
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const storeRating = (req, res) => {
	try {
		// console.log(req.body);
		const { custId } = VerifyToken(req.body.ticketSession)
		fetchOne(models.Ticket, {custId, roomName: req.body.ticketSession})
		.then(result => {
			const data = {
				ticketId: result.id,
				score: parseInt(req.body.rating),
				comment: req.body.comment
			}
			create(models.Rating, data);
		})
	} catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const fetchCustomer = async (req, res) => {
	try {
		const result = await fetchAll(User, {});
		if (result == null){
			return res.status(404).json({ success: false, message:"DB Empty" })
		}
		return res.status(200).json({ success: true, result })
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const register = async (req, res) => {
	try {
		const check = await fetchOne(User, {email:req.body.email});
		if (check != null){
			return res.status(409).json({ success: false, message: "email already exists" })
		} else {
			if (req.body.password == req.body.password2){
				const encryptedString = cryptr.encrypt(req.body.password);
				req.body['password'] = encryptedString;
				const result = await create(User, req.body);
				return res.redirect('/customer-website');
				// return res.status(200).json({ success: true, result:req.body })
			} else {
				return res.status(500).json({ success: false, msg: 'password does not match' });
			}
		}
	}
	catch (err) {
		return res.status(500).json({msg: err.message, err});
	}
}

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const regUser = await fetchOne( User, { email });
		if (regUser == null) {
			return res.redirect(`/customer-website`);
			// return res.status(404).json({ success: false, message: "email is not registered" });
		} else {
			if (cryptr.decrypt(regUser.password) == password){
				const token = await CreateToken({ email, userId: regUser.id }, '50d');
				return res.redirect(`logged/?token=${token}`);
			} else {
				return res.redirect(`/customer-website`);
				// return res.status(400).json({ success: false, message: "Invalid Credentials" })
			}
		}

	}
	catch (err) {
		return res.status(500).json({msg: err.message, err});
	}
}

const form = async (req, res) => {
	try{
		
		/*
		even after nodemailer part is commented out, the Unhandled promise rejection persist,
		so at least it's not nodemailer's fault.
		*/
		
		async function main() {
			let transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
				  user: "komputersainsteknik@gmail.com", 
				  pass: "iuli2019", 
				},
			  });
	
			let info = {
				from: '"Agent" <agent@example.com>',
				to: req.body.email,
				subject: "Thank you for your mail",
				html: "<p>This is an automated reply mail. Our agent will reply back to you ASAP</p>"
			}
	
			await transporter.sendMail(info);
			
			console.log("Message sent: %s", (await transporter.sendMail(info)).messageId);
			  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
		}
		
		main().catch(console.error);
		
		const body = {
			name: req.body.name,
			email: req.body.email,
			message: req.body.message,
			complaintCategory: req.body.complaintCategory,
			complaintStatus: 'open'
		}

		const result = await models.Form.create(body);

		/*
		return res.status(201).json({
			message: "Form created successfullyy",
			result 
		});
		*/
		return res.status(201).redirect(`/customer-website`);

	}
	// .redirect(`/customer-website`) --> source of problem
	// so how to redirect after send? IDK
	// att 1: nodemailer commented out -> error persists
	// att 2: remove redirect(`cw`) in success return result -> yep gone. 
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message, err});
	}
}


const render = async (req, res) => {
	try {
		res.render('customerWebsite', {layout: 'main'})
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const renderLOG = async (req, res) => {
	try {
		let {token} = req.query;
		try{
			const verify = await VerifyToken(token);
			const user = await User.findOne({ raw: true, where: { email: verify.email } });
			res.render('customerWebsiteLogged', {user:{user}, layout: 'cwl'});
		} catch(err) {
			// console.log(req)
			// return res.status(405).json({message: 'Failed to authenticate token.' });
			return res.redirect(`/customer-website`);
		}
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

module.exports = {
	test,
	fetchCustomer,
	storeRating,
	login,
	register,
	form,
	render,
	renderLOG
}