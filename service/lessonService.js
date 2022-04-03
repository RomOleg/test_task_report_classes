const moment = require('moment');
const { Sequelize } = require('sequelize');
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

    async getAll(date, status, teacherId, studentCount, limit, offset) {
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
        
        lesson = getTransformObject(lesson.rows);

        return lesson;
    }

    #getTransformObject(lesson) {
        return lesson.map(les => {
            /* 
                {
                    id : 9 // id занятия
                    date: ‘2019-09-01’ // Дата занятия
                    title: ‘Orange’, // Тема занятия
                    status: 1 // Статус занятия
                    visitCount: 3, // Количество учеников, посетивших занятие (по полю visit)
                    students: [ // Массив учеников, записанных на занятие
                        { id: 1, // id ученика
                        name: ‘Ivan’ // имя
                        visit: true,
                        }
                    ],
                    teachers: [ // Массив учителей, ведущих занятие
                        { id: 1, // id учителя
                        name: ‘Tanya’ // имя
                        }
                    ]
                }
            */
            const obj = {};
            obj.id = les.id;
            obj.date = les.date;
            obj.title = les.title;
            obj.status = les.status;
            obj.visitCount = 0;
            obj.student = les.lesson_students.map(student => {
                // count student visit lesson
                if (student.visit === true) obj.visitCount++;
                return student;
            });
            obj.teacher = les.lesson_teachers.map(student => {
                // count student visit lesson
                if (student.visit === true) obj.visitCount++;
                return student;
            });

            return obj;
        })
    }
}

module.exports = new LessonService();