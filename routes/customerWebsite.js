const express = require('express');
const cwController = require('../controller/customerWebsite');

const router = express.Router();

router.get('/', cwController.test);

module.exports = router