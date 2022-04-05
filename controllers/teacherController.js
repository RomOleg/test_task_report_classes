const ApiError = require("../error/ApiError");
const teacherService = require("../service/teacherService");

class TeacherController {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      const teacher = await teacherService.create(name);
      return res.json(teacher)
    } catch (error) {
      next(ApiError.internal(error.message));
    }
  }

}

module.exports = new TeacherController();
