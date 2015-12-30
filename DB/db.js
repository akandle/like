var Sequelize = require('sequelize');

var sequelize = new Sequelize('postgres://postgres@localhost:5432/likedb');

// var sequelize = new Sequelize('postgres://admin:test@localhost:5432/liketest');

console.log('Database connected.');

module.exports = sequelize;
