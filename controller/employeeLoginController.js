const Cryptr = require('cryptr');
const cryptr = new Cryptr('cusem_super_key');

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
	try {
		console.log("Test");
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