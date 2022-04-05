const sequelize = require('../config.db')
const {DataTypes} = require('sequelize')

const Lesson = sequelize.define('lessons', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date: {
        type: DataTypes.DATE
    },
    title: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
})

module.exports = Lesson;
