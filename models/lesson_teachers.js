const sequelize = require('../config.db')
const {DataTypes} = require('sequelize')
const Teacher = require('./teachers');
const Lessons = require('./lessons');

const Lesson_teachers = sequelize.define('lesson_teachers', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

Teacher.hasMany(Lesson_teachers, {foreignKey : 'id'});
Lesson_teachers.belongsTo(Teacher, {foreignKey : 'teacher_id'});

Lessons.hasMany(Lesson_teachers, {foreignKey : 'id'});
Lesson_teachers.belongsTo(Lessons, {foreignKey : 'lesson_id'});

module.exports = Lesson_teachers;