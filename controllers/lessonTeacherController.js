const moment = require("moment");
const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");
const Lesson_teachers = require("../models/lesson_teachers");
const lessonTeacherService = require("../service/lessonTeacherService");

class LessonTeacherController {
  async create(req, res, next) {
    try {
      const { lessonId, teacherId } = req.body;
      const lessonTeacher = await lessonTeacherService.create({ lessonId, teacherId });
      return res.json(lessonTeacher)
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}  

module.exports = new LessonTeacherController();