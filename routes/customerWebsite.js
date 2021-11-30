const express = require('express');
const cwController = require('../controller/customerWebsite');

const router = express.Router();

router.get('/', cwController.render);

router.get('/get', cwController.fetchCustomer);

router.post('/sign-up', cwController.register);

router.post('/sign-in', cwController.login);

router.get('/logged', cwController.renderLOG);

router.post('/logged/chat-submit', cwController.test);

router.get('/t', cwController.test);

module.exports = router