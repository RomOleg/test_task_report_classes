const ApiError = require("../error/ApiError");
const lessonService = require("../service/lessonService");

class StudentController {
  async create(req, res, next) {
    try {
      const { title, days, teacherIds, firstDate, lessonsCount, lastDate } = req.body;

      if (lessonsCount && lastDate) next(ApiError.badRequest('Должен использоваться только один параметр, либо lastDate, либо lessonsCount'));

      if (!title) next(ApiError.badRequest('Обязательный параметр title не указан'));
      if (!days) next(ApiError.badRequest('Обязательный параметр days не указан'));

      if (lessonsCount && firstDate) next(ApiError.badRequest('Обязательный параметр lessonsCount или firstDate не указан'));
      if (lastDate && firstDate) next(ApiError.badRequest('Обязательный параметр lastDate или firstDate не указан'));

      const lesson = await lessonService.create(date, title, status);

      return res.json(lesson)
    } catch (error) {
      next(ApiError.internal(error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      let { date, status, teacherIds, studentCount, lessonsPerPage, page } = req.query;

      if (studentCount) studentCount = lessonService.rangeStudent(studentCount, next);

      page = page || 1;
      const limit = lessonsPerPage || 5;
      const offset = page * limit - limit;
      const lesson = await lessonService.getAll(date, status, teacherIds, studentCount, limit, offset);
      
      return res.json(lesson)
    } catch (error) {
      next(ApiError.internal(error.message));
    }
  }
}  

module.exports = new StudentController();