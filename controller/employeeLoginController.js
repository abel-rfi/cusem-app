const Cryptr = require('cryptr');
const cryptr = new Cryptr('cusem_super_key');

const { VerifyToken, CreateToken } = require('../middlewares/auth');

const models = require('../models');
const Employee = models.Employee;

// Function Section

exports.createEmployee = async (req, res) => {
	try {
		const { email } = req.body;
		const users = Employee.findAll({where: {email}});
		if (users.length > 0) {
			return res.status(500).json({success: false, msg: "Email already been used"});
		} else{
			const encryptedString = cryptr.encrypt(req.body.password);
			req.body['password'] = encryptedString;
			const result = await Employee.create(req.body);
			return res.status(200).json({success: true, result});
		}
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({ msg: err.message });
	}
}

exports.login = async (req, res) => {
	let errT = [];

	try {
		const {email, password, roles} = req.body;
		const employee = await Employee.findOne({where: {email, roles}});
		if (employee == null) {
			errT.push({text: `${roles} not found!`});
			return res.render('employeeLoginPage', { errT, layout: 'normal'});
		}
		if (cryptr.decrypt(employee.password) == password) {
			const token = await CreateToken({email, agentId: employee.id}, '1d');
			const expires = new Date();
			expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));
			res.cookie('agentToken', token, {
				secure: true,
				httpOnly: true,
				sameSite: 'strict',
				expires
			});
			return res.redirect(`/${roles}-dashboard`);
		} else {
			errT.push({text: 'Wrong Password!'});
			return res.render('employeeLoginPage', { errT, layout: 'normal'});
		}
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({ msg: err.message });
	}
}

// Render Section

exports.render = async (req, res) => {
	try {
		res.render('employeeLoginPage', { layout: 'normal' })
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({ msg: err.message });
	}
}