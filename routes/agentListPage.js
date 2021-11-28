const express = require('express');
const agLsController = require('../controller/agentListPage');

const router = express.Router();

router.get('/', agLsController.render);
router.get('/search', agLsController.search)
router.get('/t', agLsController.test);
router.get('/open-agent/:id', agLsController.open)
router.post('/open-agent/:id', agLsController.update)
router.delete('/open-agent/:id', agLsController.deleteAgent)

module.exports = router