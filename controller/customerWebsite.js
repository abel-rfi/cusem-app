const auth = require('../middlewares/auth');
const {fetchAll, fetchOne, create} = require('../middlewares/CRUD');
const models = require('../models');

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

/*
function save(req, res){
	const post = {
		name: req.body.name,
		email: req.body.email,
		message: req.body.message,
		complaintCategory: req.body.complaintCategory,
		id: 1,
	}
	models.Form.create(post).then(result => {
		res.status(201).json({
			message: "Form created successfully",
			post: result
		});
	}).catch(error => {
		res.status(500).json({
			message: "Something went wrong",
			error: error
		});		
	});
}
*/

const form = async (req, res) => {
	try {
		const check = await User.findOne({ where: {email:req.body.email} });
		if (check != null){
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