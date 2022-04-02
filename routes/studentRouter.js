const Router = require('express');
const studentController = require('../controllers/studentController');

const router = new Router()

router.post('/', studentController.create)

module.exports = router;