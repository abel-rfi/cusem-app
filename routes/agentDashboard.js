const express = require('express');
const adController = require('../controller/agentDashboard');

const router = express.Router();

router.get('/live-chat', adController.renderLc);

router.get('/live-chat/customer-selector', adController.renderCS);

router.get('/live-chat/forward-selector', adController.renderFS1);

router.get('/live-chat/forward-sender', adController.renderFS2);

router.get('/t', adController.test);

module.exports = router