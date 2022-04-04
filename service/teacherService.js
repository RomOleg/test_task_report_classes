const Teacher = require('../models/teachers');

class TeacherService {
    async create(name) {
        const teacher = await Teacher.create({ name });
        return teacher;
    }
}

module.exports = new TeacherService();