const models = require('../models');
const employees = models.Employee;

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


// test fungsi
const dat = (req, res) => {
	employees.findAll()
		.then(emplo => {
			console.log(emplo);
			res.redirect('/employee-login-page');
		})
		.catch(err => console.log(err))
}

const add = (req, res) => {
	const data = {
		name: 'able',
		email: 'able@x.v',
		password: 'beable',
		roles: 'agent',
		phone: '34555',
		address: 'lintasan'
	}
	let { name, email, password, roles, phone, address } = data;

	employees.create({
		name,
		email,
		password,
		roles,
		phone,
		address
	})

		.then(emplo => {
			console.log(emplo);
			res.redirect('/employee-login-page');
		})
		.catch(err => console.log(err))
}

module.exports = {
	test,
	render,
	dat,
	add
}