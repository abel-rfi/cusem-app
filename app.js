const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { engine } = require('express-handlebars');
const cookieParser = require('cookie-parser');

const app = express();

// Handlebars
app.engine('handlebars',engine({
	layoutsDir: path.join(__dirname, 'views/layouts'),
	helpers: require('./config/handlebars-helpers')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Body parser
app.use(bodyParser.urlencoded({extended:false}));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Enable cookie parser
app.use(cookieParser());

// Routes
const cwRoute2 = require('./routes/customerWebsite');
const cwRoute = require('./routes/customerWebsiteRoutes');
const elpRoute = require('./routes/employeeLoginPage');
const agLsRote = require('./routes/agentListPage');
const usLsRote = require('./routes/userListPage');
const adRoute = require('./routes/agentDashboard');
const FAQlRoute = require('./routes/FAQlist');
const EmailRoute = require('./routes/agentEmail');
const LCHRoute = require('./routes/liveChatHisto');
const admin = require('./routes/adminDashboard');

app.use(bodyParser.json());

// set Routes
app.use('/customer-website2', cwRoute2);
app.use('/customer-website', cwRoute);
app.use('/employee-login-page', elpRoute);
app.use('/agent-list-page', agLsRote);
app.use('/user-list-page', usLsRote);
app.use('/agent-dashboard', adRoute);
app.use('/faq-list-page', FAQlRoute);
app.use('/email-page', EmailRoute);
app.use('/download-page', LCHRoute);
app.use('/admin-dashboard', admin);

module.exports = app;
