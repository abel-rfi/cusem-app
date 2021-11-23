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
		return res.status(500).json({msg: err.message});
	}
}

const render = (req, res) => {
	employees.findAll({ raw: true,  where: { roles: "agent" } })
    .then(emplo => res.render('agentListPage', {
        emplo, layout: 'agentLsPg'
      }))
    .catch(err => res.render('error', {error: err}));
}

module.exports = {
	test,
	render
}