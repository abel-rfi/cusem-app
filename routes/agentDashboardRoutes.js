const express = require('express');
const Controller = require('../controller/agentDashboardController');
const auth = require('../middlewares/auth');

const router = express.Router();

// With Authorization
router.use(auth.checkTokenAgent);
router.get('/', Controller.render);
router.get('/ticket-archieve/', Controller.renderTA);
router.get('/live-chat/', Controller.renderLC);
router.get('/live-chat/:id', Controller.renderLC);

module.exports = router