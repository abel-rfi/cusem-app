const express = require('express');
const elpController = require('../controller/employeeLoginPage');

const router = express.Router();

router.get('/', elpController.render);
router.post('/', elpController.data);
router.get('/t', elpController.test);

router.get('/d', elpController.dat);
router.get('/add', elpController.add);

module.exports = router