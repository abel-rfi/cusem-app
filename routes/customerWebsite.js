const express = require('express');
const cwController = require('../controller/customerWebsite');

const router = express.Router();

router.get('/', cwController.render);

router.get('/logged', cwController.renderLOG);

router.get('/t', cwController.test);

module.exports = router