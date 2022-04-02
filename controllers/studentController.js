const moment = require("moment");
const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");
const Student = require("../models/students");

class StudentController {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      const student = await Student.create({ name });
      return res.json(student)
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}  

module.exports = new StudentController();