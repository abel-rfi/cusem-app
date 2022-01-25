const express = require('express');
const Controller = require('../controller/customerWebsiteController');

const router = express.Router();

// Without Authorization
router.get('/', Controller.renderNoLog);
router.post('/sign-up', Controller.register);
router.post('/sign-in', Controller.login);

// With Authorization


module.exports = router