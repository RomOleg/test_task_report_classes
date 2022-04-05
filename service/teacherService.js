const Teacher = require('../models/teachers');

class TeacherService {
    async create(name) {
        const teacher = await Teacher.create({ name });
        return teacher;
    }

    async getTeachers(teacherIds) {
        const teachers = await Teacher.findAll({
          where: {
            id: teacherIds
          }
        });
        
        return teachers;
      }
}

module.exports = new TeacherService();