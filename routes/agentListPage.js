const express = require('express');
const agLsController = require('../controller/agentListPage');

const router = express.Router();

router.get('/', agLsController.render);

router.get('/t', agLsController.test);

module.exports = router