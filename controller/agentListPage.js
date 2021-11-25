const db = require('../config/config.json')
const models = require('../models');
const employees = models.Employee;
const mysql = require('mysql2')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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
    .catch(err => res.json({
		"message": err
	}));
}

const search = (req, res) => {
	let { term } = req.query;
  
	// Make lowercase
	term = term.toLowerCase();
  
	employees.findAll({raw:true,  where: { name: { [Op.like]: '%' + term + '%' }, roles:"agent" } })
	  .then(emplo => res.render('agentListPage', { emplo, layout: 'agentLsPg' }))
	  .catch(err => res.json({
		"message": err
	}));
  };

module.exports = {
	test,
	render,
	search
}