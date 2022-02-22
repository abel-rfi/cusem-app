const nodemailer = require("nodemailer");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('cusem_super_key');

// Middlewares
const {fetchAll, fetchOne, create} = require('../middlewares/CRUD');
const { VerifyToken, CreateToken } = require('../middlewares/auth');

const models = require('../models');
const User = models.User;
const Ticket = models.Ticket;
const Chat = models.Chat;

// Function Section

exports.register = async (req, res) => {
	try {
		const check = await fetchOne(User, {email:req.body.email});
		if (check != null){
			return res.status(409).json({ success: false, message: "email already exists" })
		} else {
			if (req.body.password == req.body.password2){
				const encryptedString = cryptr.encrypt(req.body.password);
				req.body['password'] = encryptedString;
				const result = await create(User, req.body);

				// Create Token
				const token = await CreateToken({ email: result.email, userId: result.id }, '1d');

				// Create Cookie
				let expires = new Date();
				expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));
				res.cookie('token', token, {
					secure: true,
					httpOnly: true,
					sameSite: 'strict',
					expires
				});
				// return res.status(200).json({ success: true, result })
				return res.redirect(`logged`);
			} else {
				return res.status(500).json({ success: false, msg: 'password does not match' });
			}
		}
	}
	catch (err) {
		return res.status(500).json({msg: err.message, err});
	}
}

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const regUser = await fetchOne( User, { email });
		if (regUser == null) {
			// return res.redirect(`/customer-website`);
			return res.status(404).json({ success: false, message: "email is not registered" });
		} else {
			if (cryptr.decrypt(regUser.password) == password){
				const token = await CreateToken({ email, userId: regUser.id }, '1d');
				let expires = new Date();
				expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));
				res.cookie('token', token, {
					secure: true,
					httpOnly: true,
					sameSite: 'strict'
				});
				// return res.status(200).json({Result: "Success"});
				return res.redirect(`logged`);
			} else {
				// return res.redirect(`/customer-website`);
				return res.status(400).json({ success: false, message: "Invalid Credentials" })
			}
		}

	}
	catch (err) {
		return res.status(500).json({msg: err.message, err});
	}
}

exports.logout = async (req, res) => {
	try {
		res.clearCookie('token');
		return res.redirect('/customer-website');
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

exports.createTicket = async (req, res) => {
	try {
		const {email, userId:id} = req.body.decoded;
		const user = await User.findOne({raw: true, where: {id, email}});
		const ticket = {
			custId: user.id,
			complaintStatus: "Open",
			complaintCategory: req.body.complaintCategory,
			ticketType: "Live Chat",
			passedFor: 0,
			passedTo: null,
			passedFrom: null,
			roomName: req.body.roomId
		};
		Ticket.create(ticket);
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

exports.saveChat = async (req, res) => {
	try {
		const {email, userId:id} = req.body.decoded;
		const {roomId, msg} = req.body;

		let condition = {
			custId:id, 
			roomName: roomId, 
			ticketType: "Live Chat"
		};
		const ticket = await Ticket.findOne({raw: true, where: condition});

		const chat = {
			ticketId: ticket.id,
			sender: "user",
			message: msg
		};

		Chat.create(chat);
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

// Render Section

exports.renderNoLog = async (req, res) => {
	try {
		res.render('customerWebsite', {layout: 'main'});
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

exports.renderLog = async (req, res) => {
	try {
		const {email, userId:id} = req.body.decoded;
		const user = await User.findOne({raw: true, where: {id, email}});
		if (req.cookies.roomId != undefined) {
			const {roomId} = req.cookies;
			let condition = {
				custId: id, 
				roomName: roomId, 
				ticketType: "Live Chat"
			};	
			const ticket = await Ticket.findOne({raw: true, where: condition});
			if (ticket != null){
				const chats = await Chat.findAll({raw: true, where: {ticketId: ticket.id}, order: [['createdAt', 'ASC']]});
				return res.render('customerWebsiteLogged', {layout: 'cwl', user:{user}, chats});
			}
		}
		return res.render('customerWebsiteLogged', {layout: 'cwl', user:{user}});
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}