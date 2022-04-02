const moment = require("moment");
const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");
const Lesson = require("../models/lessons");

class StudentController {
  async create(req, res, next) {
    try {
      const { date, title, status } = req.body;
      const lesson = await Lesson.create({ date, title, status });
      return res.json(lesson)
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}  

module.exports = new StudentController();