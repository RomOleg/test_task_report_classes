const moment = require("moment");
const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");
const Lesson_students = require("../models/lesson_students");

class LessonStudentController {
  async create(req, res, next) {
    try {
      const { lessonId, studentId, visit } = req.body;
      const lessonStudent = await Lesson_students.create({ lessonId, studentId, visit });
      return res.json(lessonStudent)
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}  

module.exports = new LessonStudentController();