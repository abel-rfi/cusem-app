const express = require('express');
const Controller = require('../controller/customerWebsiteController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Without Authorization
router.get('/', Controller.renderNoLog);
router.post('/sign-up', Controller.register);
router.post('/sign-in', Controller.login);

// With Authorization
router.use(auth.checkToken);
router.get('/logged', Controller.renderLog);


module.exports = router