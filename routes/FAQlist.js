const express = require('express');
const FAQlistCon = require('../controller/FAQList');

const router = express.Router();

router.get('/', FAQlistCon.render);
router.get('/t', FAQlistCon.test);
router.get('/search', FAQlistCon.search)
router.get('/create-faq', FAQlistCon.create)
router.post('/create-faq', FAQlistCon.createFAQ)
router.get('/unsolved-faq-page/:id', FAQlistCon.renderUnsolvedFAQ)
router.post('/unsolved-faq-page/:id', FAQlistCon.jawabAgent)
router.get('/solved-faq-page/:id', FAQlistCon.renderSolvedFAQ)

module.exports = router