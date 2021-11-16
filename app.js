const express = require('express');

// IDK part
const app = express();

// Routes
const cwRoute = require('./routes/customerWebsite');

// App use
app.use('/', cwRoute);

module.exports = app