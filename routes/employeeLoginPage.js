const express = require('express');
const elpController = require('../controller/employeeLoginPage');

const router = express.Router();

router.get('/', elpController.render);
router.post('/', elpController.loginEmployee);
router.post('/add', elpController.createEmployee);
router.get('/get', elpController.getEmployees);
router.get('/get/:id', elpController.getEmployeeById);
router.delete('/delete/:id', elpController.deleteEmployee);
router.patch('/update', elpController.updateEmployee);
router.get('/test', elpController.test);



module.exports = router