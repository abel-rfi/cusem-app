const express = require('express');
const Controller = require('../controller/employeeLoginController');

const router = express.Router();

// Without Authorization
router.get('/', Controller.render);

// router.post('/create', Controller.);

module.exports = router