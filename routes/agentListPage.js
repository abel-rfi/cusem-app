const express = require('express');
const agLsController = require('../controller/agentListPage');

const router = express.Router();

router.get('/', agLsController.render);
router.get('/search', agLsController.search)
router.get('/t', agLsController.test);

module.exports = router