var Sequelize = require('sequelize');

var sequelize = new Sequelize('postgres://admin2:test@localhost:5432/likedb');

console.log('Database connected.');

module.exports = sequelize;