const express = require('express');
const agEmController = require('../controller/agentEmail');

const router = express.Router();

router.get('/', agEmController.render);
router.get('/open-email/:id', agEmController.openEmail);
router.get('/open-email/:id/reply', agEmController.replyEmail);

/*
router.get('/search', agLsController.search)
router.get('/t', agLsController.test);
router.get('/create-agent', agLsController.create)
router.post('/create-agent', agLsController.createAgent)
router.get('/open-agent/:id', agLsController.open)
router.post('/open-agent/:id', agLsController.update)
router.delete('/open-agent/:id', agLsController.deleteAgent)
*/
module.exports = router