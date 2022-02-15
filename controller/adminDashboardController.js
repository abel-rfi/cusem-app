const Op = require('sequelize').Op;

const models = require('../models');

// Function Section

// Render Section

// Main Dashboard
exports.render = async (req, res) => {
	try {
		return res.render('adminDashboard', {layout: 'adminNav'});
	} catch(err) {
		console.log(`msg: ${err.message}`);
		// return res.redirect('/employee-login-page');
		return res.status(500).json({msg: err.message});
	}
}
// Main Dasboard End

// User List
exports.renderCL = async (req, res) => {
	try {
		return res.render('adminCustomerList', {layout: 'adminNav'})
	} catch(err) {
		console.log(`msg: ${err.message}`);
		// return res.redirect('/employee-login-page');
		return res.status(500).json({msg: err.message});
	}
}
// User List End

// Employee List
exports.renderEL = async (req, res) => {
	try {
		return res.render('adminEmployeeList', {layout: 'adminNav'})
	} catch(err) {
		console.log(`msg: ${err.message}`);
		// return res.redirect('/employee-login-page');
		return res.status(500).json({msg: err.message});
	}
}
// Employee List End

// Employee Rating
exports.renderER = async (req, res) => {
	try {
		return res.render('adminEmployeeRating', {layout: 'adminNav'})
	} catch(err) {
		console.log(`msg: ${err.message}`);
		// return res.redirect('/employee-login-page');
		return res.status(500).json({msg: err.message});
	}
}
// Employee Rating End
