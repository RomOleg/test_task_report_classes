const Lesson_teachers = require('../models/lesson_teachers');

class LessonTeacherService {
    async create(lessonId, teacherId) {
        const lessonTeacher = await Lesson_teachers.create({ lesson_id: lessonId, teacher_id: teacherId });
        return lessonTeacher;
    }
}

module.exports = new LessonTeacherService();