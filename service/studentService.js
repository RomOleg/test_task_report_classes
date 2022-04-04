const Student = require('../models/students');

class StudentService {
    async create(name) {
        const student = await Student.create({ name });
        return student;
    }
}

module.exports = new StudentService();