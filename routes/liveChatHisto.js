const express = require('express');
const LHController = require('../controller/liveChatHisto');

const router = express.Router();

router.get('/', LHController.render);
router.get('/download/ticket', LHController.downloadTicket);
router.get('/download/rating', LHController.downloadRating);

module.exports = router