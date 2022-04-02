const Router = require('express');
const lessonTeacherController = require('../controllers/lessonTeacherController');

const router = new Router()

router.post('/', lessonTeacherController.create)

module.exports = router;