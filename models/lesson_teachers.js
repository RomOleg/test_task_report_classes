const sequelize = require('../config.db')
const {DataTypes} = require('sequelize')
const Teacher = require('./teachers');
const Lessons = require('./lessons');

const Lesson_teachers = sequelize.define('lesson_teachers', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

Teacher.hasMany(Lesson_teachers);
Lesson_teachers.belongsTo(Teacher);

Lessons.hasMany(Lesson_teachers);
Lesson_teachers.belongsTo(Lessons);

module.exports = Lesson_teachers;