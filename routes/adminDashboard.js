const express = require('express');
const adminController = require('../controller/admin');

const router = express.Router();

router.get('/', adminController.renderDashb);
router.get('/agent-manager', adminController.render);
router.get('/agent-manager/agent-editor', adminController.renderAgent);
router.get('/faq-list', adminController.renderFAQ); // from const admin controller, with the function render
router.get('/report-list', adminController.renderReport);
router.get('/customer-manager', adminController.renderCustomer);



module.exports = router;