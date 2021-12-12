const express = require('express');
const adminController = require('../controller/admin');

const router = express.Router();

router.get('/', adminController.renderDashb);
router.get('/agent-manager', adminController.render);
router.get('/agent-manager/agent-editor', adminController.renderAgent);
router.get('/faq-list', adminController.renderFAQ); // from const admin controller, with the function render


module.exports = router;