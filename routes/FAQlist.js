const express = require('express');
const FAQlistCon = require('../controller/FAQList');

const router = express.Router();

router.get('/', FAQlistCon.render);
router.get('/t', FAQlistCon.test);
router.get('/agent-faq-page', FAQlistCon.renderAgent)
router.get('/admin-faq-page', FAQlistCon.renderAdmin)

module.exports = router