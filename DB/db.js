var Sequelize = require('sequelize');

var sequelize = new Sequelize('postgres://postgres@localhost:5432/likedb');

console.log('Database connected.');

module.exports = sequelize;
