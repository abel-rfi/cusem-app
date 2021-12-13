const express = require('express');
const adController = require('../controller/agentDashboard');

const router = express.Router();

router.get('/', adController.render);

router.get('/ticket-archieve', adController.renderTA);

router.get('/live-chat', adController.renderLc);

router.get('/live-chat/customer-selector', adController.renderCS);

router.get('/live-chat/forward-selector', adController.renderFS1);

router.get('/live-chat/forward-sender', adController.renderFS2);

router.post('/live-chat/change-status', adController.changeStatus);

router.post('/live-chat/forward-ticket', adController.forwardTicket);

router.post('/live-chat/accept-forward', adController.acceptForward);

router.post('/t', adController.test);

module.exports = router