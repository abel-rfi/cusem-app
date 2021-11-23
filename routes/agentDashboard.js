const express = require('express');
const adController = require('../controller/agentDashboard');

const router = express.Router();

router.get('/', adController.renderMain);

router.get('/customer-selector', adController.renderCS);

router.get('/forward-selector', adController.renderFS1);

router.get('/forward-sender', adController.renderFS2);

router.get('/t', adController.test);

module.exports = router