const sequelize = require('../config.db')
const {DataTypes} = require('sequelize')

const Student = sequelize.define('student', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {
        type: DataTypes.STRING
    },
})

module.exports = Student;
