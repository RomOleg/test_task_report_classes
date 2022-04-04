const moment = require('moment');
const { Sequelize } = require('sequelize');
const ApiError = require('../error/ApiError');
const Lesson = require("../models/lessons");
const Lesson_students = require('../models/lesson_students');
const Lesson_teachers = require('../models/lesson_teachers');
const Student = require('../models/students');
const Teacher = require('../models/teachers');

class LessonService {
    async create(date, title, status) {
        const lesson = await Lesson.create({ date, title, status });
        return lesson;
    }
    // TODO refactor code - query student by studentCount
    async getAll(date, status, teacherId = '', studentCount = [], limit, offset) {
        const where = {};
        const whereTeacher = {};
        
        if (date) where.date = moment.utc(date);
        if (status) where.status = status;

        if (teacherId) whereTeacher.teacherId = teacherId.split(',');
        
        let lesson = await Lesson.findAndCountAll({
            where: {
                ...where,
            },
            include: [
                {
                    model: Lesson_teachers,
                    include: Teacher,
                    where: {
                        ...whereTeacher,
                    },
                },
                {
                    model: Lesson_students,
                    include: [
                        {
                            model: Student,
                        },
                    ],
                }
            ],
            limit,
            offset,
        });
        
        lesson = this.#getTransformObject(lesson.rows, studentCount);

        return lesson;
    }
    /**
     * 
     * @param {*} lesson 
     * @param {*} studentCount 
     * @returns 
     */
    #getTransformObject(lesson, studentCount = []) {
        return lesson.map(les => {
            if ( 
               studentCount.length &&
               !studentCount.includes(les.lesson_students.length) 
            ) return null;
            const obj = {};
            obj.id = les.id;
            obj.date = les.date;
            obj.title = les.title;
            obj.status = les.status;
            obj.visitCount = 0;
            obj.student = les.lesson_students.map(student => {
                // count student visit lesson
                if (student.visit === true) obj.visitCount++;
                const { id, name } = student.student;
                return { id, name };
            });
            obj.teacher = les.lesson_teachers.map(teacher => {
                const { id, name } = teacher.teacher;
                return { id, name };
            });

            return obj;
        }).filter(obj => obj !== null)
    }

    rangeStudent(studentCount = '', next) {
        try {
            if(!studentCount.match(/(^\d)|(,\d)/gm)) {
                next(ApiError.badRequest('studentCount должен содержать только число или числа через запятую без пробелов')); 
            }
            if (studentCount.length === 1) {
                return [+studentCount];
            } else {
                let result = [];
                studentCount = JSON.parse(`[${studentCount}]`);
                let min = Math.min.apply(null, studentCount);
                let max = Math.max.apply(null, studentCount);
                for (let index = min; index <= max; index++) {
                    result.push(index);
                }
                return result;
            }
        } catch (error) {
            next(ApiError.badRequest('studentCount должен сожержать только числа'))
        }
    }
}

module.exports = new LessonService();