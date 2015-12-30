var Sequelize = require('sequelize');

var sequelize = new Sequelize('postgres://postgres@localhost:5432/likedb', {logging: false});

console.log('Database connected.');

module.exports = sequelize;
