const express = require('express');
const agLsController = require('../controller/agentListPage');

const router = express.Router();

router.get('/', agLsController.render);
router.post('/', agLsController.search)
router.get('/t', agLsController.test);
router.get('/create-agent', agLsController.create)
router.post('/create-agent', agLsController.createAgent)
router.get('/open-agent/:id', agLsController.open)
router.post('/open-agent/:id', agLsController.update)
router.delete('/open-agent/:id', agLsController.deleteAgent)

module.exports = router