const Op = require('sequelize').Op;

const models = require('../models');

// Function Section

// Render Section
exports.render = async (req, res) => {
	try {
		return res.render('agentDashboard', {layout: 'newAgentNav'});
	} catch(err) {
		console.log(`msg: ${err.message}`);
		// return res.redirect('/employee-login-page');
		return res.status(500).json({msg: err.message});
	}
}

exports.renderTA = async (req, res) => {
	try {
		return res.render('ticketArchieve', {layout: 'newAgentNav'});
	} catch(err) {
		console.log(`msg: ${err.message}`);
		// return res.redirect('/employee-login-page');
		return res.status(500).json({msg: err.message});
	}
}

exports.renderLC = async (req, res) => {
	try {
		return res.render('agentLiveChat', {layout: 'newAgentNav'});
	} catch(err) {
		console.log(`msg: ${err.message}`);
		// return res.redirect('/employee-login-page');
		return res.status(500).json({msg: err.message});
	}
}