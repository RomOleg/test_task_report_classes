const moment = require("moment");
const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");
const Lesson = require("../models/lessons");
const Lesson_students = require("../models/lesson_students");
const Lesson_teachers = require("../models/lesson_teachers");
const Student = require("../models/students");

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

  async getAll(req, res, next) {
    try {
      let { limit, page } = req.query;
      page = page || 1;
      limit = limit || 5;
      let offset = page * limit - limit;
      let lesson;
      lesson = await Lesson_students.findAndCountAll({
        where: {
          visit: true
        },
        include: [
          { model: Lesson },
          { model: Student }
        ],
        limit, 
        offset
      });
      return res.json(lesson)
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}  

module.exports = new LessonStudentController();