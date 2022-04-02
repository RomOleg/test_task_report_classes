const Router = require('express');
const lessonStudentController = require('../controllers/lessonStudentController');

const router = new Router()

router.post('/', lessonStudentController.create)

module.exports = router;