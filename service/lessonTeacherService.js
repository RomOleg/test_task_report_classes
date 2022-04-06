const Lesson_teachers = require('../models/lesson_teachers');

class LessonTeacherService {
    async create(lessonId, teacherId) {
        const lessonTeacher = await Lesson_teachers.create({ lessonId, teacherId });
        return lessonTeacher;
    }
}

module.exports = new LessonTeacherService();