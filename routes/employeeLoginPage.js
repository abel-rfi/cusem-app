const express = require('express');
const elpController = require('../controller/employeeLoginPage');

const router = express.Router();

router.get('/', elpController.render);

router.get('/t', elpController.test);

module.exports = router