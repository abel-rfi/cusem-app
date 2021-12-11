const models = require('../models');
const employees = models.Employee;
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
	try {
		res.render('employeeLoginPage', { layout: 'normal' })
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({ msg: err.message });
	}
}


// Get semua Agent
const getEmployees = async (req, res) => {
	try {
		const emplo = await employees.findAll();
		res.send(emplo);
	} catch (err) {
		console.log(err);
	}
}

// Get Agent berdasarkan id
const getEmployeeById = async (req, res) => {
	try {
		const emplo = await employees.findAll({
			where: {
				id: req.params.id
			}
		});
		res.send(emplo);
	} catch (err) {
		console.log(err);
	}
}

// Create Agent baru
const createEmployee = async (req, res) => {
	try {
		const encryptedString = cryptr.encrypt(req.body.password);
		await employees.create({
			name: req.body.name,
			email: req.body.email,
			password: encryptedString,
			roles: req.body.roles,
			phone: req.body.phone,
			address: req.body.address
		}
		);
		res.json({
			"message": "Admin Created"
		});
	} catch (err) {
		console.log(err);
	}
}

// Update agent
const updateEmployee = async (req, res) => {
	try {
		await employees.update(req.body, {
			where: {
				id: req.body.id
			}
		});
		res.json({
			"message": "Agent Updated"
		});
	} catch (err) {
		console.log(err);
	}
}

// Delete Agent berdasarkan id
const printEmployee = (req, res) => {
	try {
		var email = req.body.email;
		var password = req.body.password;
		var role = req.body.roles;
		res.json({
			"message": "email: " + email + "password: " + password + "role: " + role
		});
	} catch (err) {
		console.log(err);
	}
}

const deleteEmployee = async (req, res) => {
	try {
		await employees.destroy({
			where: {
				id: req.params.id
			}
		});
		res.json({
			"message": "Agent Deleted"
		});
	} catch (err) {
		console.log(err);
	}
}

const loginEmployee = async (req, res) => {
	let rol = req.body.roles;
	let errT = []

	try {
		const emplo = await employees.findAll({
			where: {email: req.body.email,
				roles:req.body.roles} 
		});

		 
		
		if (!emplo.length == true ) {
			errT.push({text: rol+" not found!"})
			res.render('employeeLoginPage', { errT,layout: 'normal'});
			
		} else {
			if (cryptr.decrypt(emplo[0].password) == req.body.password) {
				if (rol == 'agent') {
					res.redirect('/agent-dashboard');
				} else {
					res.json({
						"Dashboard" : "Admin dashboard"
					})
				}
			} else {
				errT.push({text: 'password wrong!'})
				res.render('employeeLoginPage', { errT,layout: 'normal'});
			}	
		}
	} catch (err) {
		console.log(err);
	}

}

module.exports = {
	test,
	render,
	updateEmployee,
	getEmployees,
	getEmployeeById,
	createEmployee,
	deleteEmployee,
	printEmployee,
	loginEmployee
}
