const jwt = require('jsonwebtoken');

const models = require('../models');
const User = models.User;

const test = (req, res) => {
	try {
		res.send("Send Login");
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const fetchCustomer = async (req, res) => {
	try {
		const result = await User.findAll();
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
		const check = await User.findOne({ where: {email:req.body.email} });
		if (check != null){
			return res.status(409).json({ success: false, message: "email already exists" })
		} else {
			// console.log(req.body);
			const result = await User.create(req.body);
			return res.status(200).json({ success: true, result })
		}
	}
	catch (err) {
		// console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message, err});
	}
}

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const regUser = await User.findOne({ where: { email } } );
		if (regUser == null) {
			return res.status(404).json({ success: false, message: "email is not registered" });
		} else {
			if (regUser.password == password){
				const token = await jwt.sign({ email, userId: regUser.id }, 'secret');
				// console.log(`success: true, token: ${token}`);
				// return res.status(200).json({ success: true, token });
				return res.redirect("logged");
			} else {
				// console.log(`regUser = ${regUser}, normal = ${password}`)
				return res.status(400).json({ success: false, message: "Invalid Credentials" })
			}
		}

	}
	catch (err) {
		// console.log(`msg: ${err.message}`);
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
}

const render = (req, res) => {
	try {
		res.render('customerWebsite', {layout: 'main'})
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const renderLOG = (req, res) => {
	try {
		res.render('customerWebsiteLogged', {layout: 'cwl'})
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