const express = require('express');
const Controller = require('../controller/adminDashboardController');

const router = express.Router();

// Without Authorization
router.get('/', Controller.render);
router.get('/customer-list', Controller.renderCL);
router.get('/employee-list', Controller.renderEL);
router.get('/employee-rating', Controller.renderER);
// With Authorization

module.exports = router