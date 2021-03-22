const Sequelize = require ('sequelize');

const sequelize = new Sequelize ('shop-node', 'root', 'Oblast66!135', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
