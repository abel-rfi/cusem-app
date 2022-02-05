const express = require('express');
const Controller = require('../controller/agentDashboardController');

const router = express.Router();

// Without Authorization
router.get('/', Controller.render);
router.get('/ticket-archieve/', Controller.renderTA);
router.get('/live-chat/', Controller.renderLC);

// With Authorization

module.exports = router