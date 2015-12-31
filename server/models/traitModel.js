var db = require('../../DB/db.js');
var Sequelize = require('sequelize');

//TODO: Documentation
var Trait = db.define('trait', {
  traitName: {
    type: Sequelize.STRING,
    field: 'trait_name'
  }
}, {
  freezeTableName: true
});

//TODO: create relationships before running sync
Trait.sync();

module.exports = Trait;