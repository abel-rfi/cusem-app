const express = require('express');
const Controller = require('../controller/agentDashboardController');
const auth = require('../middlewares/auth');

const router = express.Router();

// With Authorization
router.use(auth.checkTokenAgent);
router.get('/', Controller.render);
router.get('/edit-profile', Controller.renderEP);
router.post('/edit-profile/fill-data', Controller.fillData);
router.post('/edit-profile/change-password', Controller.changePassword);
router.get('/ticket-archieve/', Controller.renderTA);
router.post('/ticket-archieve/get-chat', Controller.getChat);
router.get('/live-chat/', Controller.renderLC);
router.get('/live-chat/:id', Controller.renderLC);
router.post('/live-chat/send', Controller.saveChat);
router.post('/live-chat/get-open', Controller.getOpenTicket);
router.post('/live-chat/take-ticket', Controller.takeTicket);
router.post('/live-chat/change-ticket-status', Controller.changeTicketStatus);
router.post('/live-chat/forward-ticket', Controller.forwardTicket);
router.post('/live-chat/get-forward-request', Controller.getForwardRequest);
router.post('/live-chat/forward-request-decision', Controller.requestDecision);
router.get('/logout', Controller.logout);

module.exports = router