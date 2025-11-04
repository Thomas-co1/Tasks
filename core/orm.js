const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('taches', 'admin', 'toto', {
    host: '127.0.0.1',
    dialect: 'mysql', // utilise mysql2 automatiquement
});

module.exports = sequelize;