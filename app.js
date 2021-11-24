const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { engine } = require('express-handlebars');

const app = express();

// Handlebars -> utk nyambungin website
app.engine('handlebars',engine({
	layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'))

// Body parser
app.use(bodyParser.urlencoded({extended:false}))

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
const cwRoute = require('./routes/customerWebsite');
const elpRoute = require('./routes/employeeLoginPage');
const agLsRote = require('./routes/agentListPage')
const adRoute = require('./routes/agentDashboard');

app.use(bodyParser.json());

// set Routes
app.use('/customer-website', cwRoute);
app.use('/employee-login-page', elpRoute);
app.use('/agent-list-page', agLsRote)
app.use('/agent-dashboard', adRoute);

module.exports = app