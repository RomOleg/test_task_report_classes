const moment = require("moment");
const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");
const Lesson_teachers = require("../models/lesson_teachers");

class LessonTeacherController {
  async create(req, res, next) {
    try {
      const { lessonId, teacherId } = req.body;
      const lessonTeacher = await Lesson_teachers.create({ lessonId, teacherId });
      return res.json(lessonTeacher)
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}  

module.exports = new LessonTeacherController();