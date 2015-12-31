var Sequelize = require('sequelize');

//TODO: Testing vs Production environment
var sequelize = new Sequelize('postgres://postgres@localhost:5432/likedb');

// var sequelize = new Sequelize('postgres://admin:test@localhost:5432/liketest');

console.log('Database connected.');

module.exports = sequelize;
