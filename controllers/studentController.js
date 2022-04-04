const moment = require("moment");
const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");
const Student = require("../models/students");
const studentService = require("../service/studentService");

class StudentController {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      const student = await studentService.create(name);
      return res.json(student)
    } catch (error) {
      next(ApiError.internal(error.message));
    }
  }
}  

module.exports = new StudentController();