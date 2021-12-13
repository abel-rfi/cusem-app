const express = require('express');
const LHController = require('../controller/liveChatHisto');

const router = express.Router();

router.get('/', LHController.render);
router.get('/download', LHController.download)

module.exports = router