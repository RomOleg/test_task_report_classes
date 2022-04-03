const moment = require("moment");
const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");
const Lesson = require("../models/lessons");
const lessonService = require("../service/lessonService");

class StudentController {
  async create(req, res, next) {
    try {
      const { date, title, status } = req.body;
      const lesson = await lessonService.create(date, title, status);

      return res.json(lesson)
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      let { date, status, teacherIds, studentCount, lessonsPerPage, page } = req.query;
      page = page || 1;
      const limit = lessonsPerPage || 5;
      const offset = page * limit - limit;
      const lesson = await lessonService.getAll(date, status, teacherIds, studentCount, limit, offset);
      
      return res.json(lesson)
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}  

module.exports = new StudentController();