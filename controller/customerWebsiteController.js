const nodemailer = require("nodemailer");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('cusem_super_key');

// Middlewares
const {fetchAll, fetchOne, create} = require('../middlewares/CRUD');
const { VerifyToken, CreateToken } = require('../middlewares/auth');

const models = require('../models');
const User = models.User;

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
				// return res.redirect('/customer-website');
				return res.status(200).json({ success: true, result:req.body })
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
				const token = await CreateToken({ email, userId: regUser.id }, '10d');
				res.cookie('token', token, {
					secure: true,
					httpOnly: true,
					sameSite: 'strict'
				});
				return res.status(200).json({Result: "Success"});
				// return res.redirect(`logged/?token=${token}`);
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

// Render Section

exports.renderNoLog = async (req, res) => {
	try {
		res.render('customerWebsite', {layout: 'main'})
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}