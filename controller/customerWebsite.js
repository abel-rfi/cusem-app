const auth = require('../middlewares/auth');
const {fetchAll, fetchOne, create} = require('../middlewares/CRUD');
const models = require('../models');
const nodemailer = require("nodemailer");
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
			const result = await create(User, req.body);
			return res.status(200).json({ success: true, result })
		}
	}
	catch (err) {
		return res.status(500).json({msg: err.message, err});
	}
}

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		// console.log(email, password)
		const regUser = await fetchOne( User, { email });
		if (regUser == null) {
			return res.redirect(`/customer-website`);
			// return res.status(404).json({ success: false, message: "email is not registered" });
		} else {
			if (regUser.password == password){
				const token = await auth.CreateToken({ email, userId: regUser.id }, '1h');
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

function form(req, res){
	const post = {
		name: req.body.name,
		email: req.body.email,
		message: req.body.message,
		complaintCategory: req.body.complaintCategory,
	}
	models.Form.create(post).then(result => {
		res.status(201).json({
			message: "Form created successfullyy",
			post: result
		});
	}).catch(error => {
		res.status(500).json({
			message: "Something went wrong",
			error: error
		});	
	});
	/*
	async function main() {
		let testAccount = await nodemailer.createTestAccount();
		let transporter = nodemailer.createTransport({
			host: "smtp.ethereal.email",
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
			  user: testAccount.user, // generated ethereal user
			  pass: testAccount.pass, // generated ethereal password
			},
		  });

		let info = await transporter.sendMail({
			from: '"Agent" <agent@example.com>',
			to: req.body.email,
			subject: "Thank you for your mail",
			html: "<p>This is an automated reply mail. Our agent will reply back to you ASAP</p>"
		})
		console.log("Message sent: %s", info.messageId);
  		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  		// Preview only available when sending through an Ethereal account
  		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
	}
	main().catch(console.error);
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
	return res.redirect(`/customer-website`);
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
			const verify = await auth.VerifyToken(token);
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
	login,
	register,
	form,
	//save:save,
	render,
	renderLOG
}