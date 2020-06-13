const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('node-complete', 'root', 'subu19', {

    dialect: 'mysql',
    host: 'localhost' 
});

module.exports = sequelize;