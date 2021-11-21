const express = require('express');
const elpController = require('../controller/employeeLoginPage');

const router = express.Router();

router.get('/', elpController.render);
router.post('/', elpController.checkData);
router.post('/c', elpController.createProduct);
router.get('/d', elpController.getProducts);
router.get('/:id', elpController.getProductById);
router.delete('/:id', elpController.deleteProduct);
router.patch('/p', elpController.updateProduct);
router.get('/t', elpController.test);



module.exports = router