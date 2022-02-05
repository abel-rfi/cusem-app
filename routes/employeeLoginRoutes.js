const express = require('express');
const Controller = require('../controller/employeeLoginController');

const router = express.Router();

// Without Authorization
router.get('/', Controller.render);

module.exports = router