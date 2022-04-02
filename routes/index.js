const Router = require('express');
const teacherRouter = require('./teacherRouter');
const lessonRouter = require('./lessonRouter');
const studentRouter = require('./studentRouter');
const lessonTeacherRouter = require('./lessonTeacherRouter');
const lessonStudentRouter = require('./lessonStudentRouter');

const router = new Router()

router.use('/teacher', teacherRouter);
router.use('/student', studentRouter);
router.use('/lesson', lessonRouter);
router.use('/lesson-teacher', lessonTeacherRouter);
router.use('/lesson-student', lessonStudentRouter);

module.exports = router
