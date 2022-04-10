const moment = require('moment');
const ApiError = require("../error/ApiError");
const teacherService = require("../service/teacherService");
const lessonService = require("../service/lessonService");
const lessonTeacherService = require('../service/lessonTeacherService');

class StudentController {
  async create(req, res, next) {
    try {
      const { title, days, teacherIds, firstDate, lessonsCount, lastDate } = req.body;

      if (lessonsCount && lastDate) return next(ApiError.badRequest('Должен использоваться только один параметр, либо lastDate, либо lessonsCount'));

      if (!title) return next(ApiError.badRequest('Обязательный параметр title не указан'));
      if (!days) return next(ApiError.badRequest('Обязательный параметр days не указан'));

      if (lessonsCount && !(lessonsCount && firstDate)) return next(ApiError.badRequest('Обязательный параметр lessonsCount или firstDate не указан'));
      if (lastDate && !(lastDate && firstDate)) return next(ApiError.badRequest('Обязательный параметр lastDate или firstDate не указан'));

      lessonService.checkTeacherInterger(teacherIds, next);

      // check teacher
      const teachers = await teacherService.getTeachers(teacherIds);

      if (teachers.length !== [...new Set(teacherIds)].length) {
        return next(ApiError.badRequest('Вы указалали идетификатор учителя, которого не существует'));
      }

      let lessons = null;
      // create lessons range date
      if (lessonsCount && firstDate) {
        const dates = lessonService.getDatesRangeByCountLessons(lessonsCount, firstDate, days);  
        lessons = await createLessons(dates, title, teacherIds, res);

        return res.json({count: lessons.length, lessons})
      // create lessons firstDate to lastDate
      } else if (lastDate && firstDate) {
        const dates = lessonService.getDatesRange(firstDate, lastDate, days);
        lessons = await createLessons(dates, title, teacherIds, res);

        return res.json({count: lessons.length, lessons})
      }

      return res.json({message: 'Ничего не создано'});
    } catch (error) {
      return next(ApiError.internal(error.message));
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

async function createLessons(dates, title, teacherIds, res) {
  if (dates.length === 0) return res.json({ message: 'Нет доступных дат для создания уроков' });
  const lessons = await Promise.all(
    dates.map(async date => {
      const lesson = await lessonService.create(date, title)
      return lesson.id;
    })
  );
  lessons.forEach(lesson => {
    teacherIds.forEach(async teacherId => await lessonTeacherService.create(lesson, teacherId))
  })
  
  return lessons;
}