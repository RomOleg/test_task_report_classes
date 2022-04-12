const sequelize = require('../config.db')
const {DataTypes} = require('sequelize');
const Student = require('./students');
const Lessons = require('./lessons');

const Lesson_students = sequelize.define('lesson_students', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    visit: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

Student.hasMany(Lesson_students, {foreignKey : 'id'});
Lesson_students.belongsTo(Student, {foreignKey : 'student_id'});

Lessons.hasMany(Lesson_students, {foreignKey : 'id'});
Lesson_students.belongsTo(Lessons, {foreignKey : 'lesson_id'});

module.exports = Lesson_students;