const models = require('../models');

function render(req, res) {
    models.Employee.findAll({raw: true, where: {roles: 'agent'}}) //display the employee data from the Employee.init (see the employee.js from models folder)
    .then(result => {
        //console.log(result) //display in the console
        res.render('userListPage', {layout: 'adminAgentSelector', usere: result}) //render the userlistpage.handlebars js into the adminDashboard.handlebars navigator
    })
};

function renderAgent(req, res) {
    res.render('createUser', {layout: 'adminAgentSelector'})
};

function renderFAQ(req, res) {
    //res.render('FAQlist', {layout: 'adminAgentSelector'})
    res.redirect('/faq-list-page');
};

function renderDashb(req, res) {
    res.render('adminMainDashboard', {layout: 'adminAgentSelector'})
};



function renderReport(req, res) {
    models.Ticket.findAll({raw: true}) //display the employee data from the Employee.init (see the employee.js from models folder)
    .then(result => {
        //console.log(result) //display in the console
        res.render('adminReportList', {layout: 'adminAgentSelector', usere: result}) //render the userlistpage.handlebars js into the adminDashboard.handlebars navigator
    })
};


function renderCustomer(req, res) {
    models.User.findAll({raw: true}) //display the employee data from the Employee.init (see the employee.js from models folder)
    .then(result => {
        //console.log(result) //display in the console
        res.render('adminCustomerList', {layout: 'adminAgentSelector', usere: result}) //render the userlistpage.handlebars js into the adminDashboard.handlebars navigator
    })
};



module.exports = {
	render,
    renderAgent,
    renderFAQ,
    renderDashb,
    renderReport,
    renderCustomer
};
