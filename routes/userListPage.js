const express = require('express');
const usLsController = require('../controller/userListPage');

const router = express.Router();

router.get('/', usLsController.render);
router.post('/', usLsController.search)
router.get('/t', usLsController.test);
router.get('/create-user', usLsController.create)
router.post('/create-user', usLsController.createUser)
router.get('/open-user/:id', usLsController.open)
router.post('/open-user/:id', usLsController.update)
router.delete('/open-user/:id', usLsController.deleteUser)

module.exports = router