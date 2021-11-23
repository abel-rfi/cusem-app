const express = require('express');
const cwController = require('../controller/customerWebsite');

const router = express.Router();

router.get('/', cwController.render);

router.get('/get', cwController.fetchCustomer);

router.post('/sign-up', cwController.register);

router.post('/sign-in', cwController.login);

/*attempt*/ 
router.post('/formsent', cwController.form);

router.get('/logged', cwController.renderLOG);

router.get('/t', cwController.test);

module.exports = router