const db = require('../config/config.json')
const models = require('../models');
const employees = models.Employee;
const mysql = require('mysql2')

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "cusem_database"
});


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


// Get semua product
const getProducts = async (req, res) => {
	try {
		const emplo = await employees.findAll();
		res.send(emplo);
	} catch (err) {
		console.log(err);
	}
}

// Get product berdasarkan id
const getProductById = async (req, res) => {
	try {
		const emplo = await employees.findAll({
			where: {
				id: req.params.id
			}
		});
		res.send(emplo[0]);
	} catch (err) {
		console.log(err);
	}
}

// Create product baru
const createProduct = async (req, res) => {
	try {
		await employees.create(req.body);
		res.json({
			"message": "Product Created"
		});
	} catch (err) {
		console.log(err);
	}
}

// Update agent
const updateProduct = async (req, res) => {
	try {
		await Product.update(req.body, {
			where: {
				id: req.params.id
			}
		});
		res.json({
			"message": "Product Updated"
		});
	} catch (err) {
		console.log(err);
	}
}

// Delete product berdasarkan id
const printProduct = (req, res) => {
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

const deleteProduct = async (req, res) => {
	try {
		await employees.destroy({
			where: {
				id: req.params.id
			}
		});
		res.json({
			"message": "Product Deleted"
		});
	} catch (err) {
		console.log(err);
	}
}

const checkData = (req, res) => {
	try {
		con.connect(function (err) {
			if (err) throw err;
			var email = req.body.email;
			var password = req.body.password;
			var role = req.body.roles;
			var sql = 'SELECT * FROM employees WHERE email = ? AND password = ? AND roles = ?';
			//Send an array with value(s) to replace the escaped values:
			con.query(sql, [email, password, role], function (err, result) {
				console.log(result);
				if (result.length >= 1) {
					res.json({
						"dashboard": "selamat datang di " + role + ' dashboard' 
					})
				} else {
					res.json ({
						"404": 'periksa kembali data anda' + email + password + role
					})
				}
			});
		});

	} catch (err) {
		console.log(err)
	}

}

module.exports = {
	test,
	render,
	updateProduct,
	getProducts,
	getProductById,
	createProduct,
	deleteProduct,
	printProduct,
	checkData
}