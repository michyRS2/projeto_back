var Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'projeto_ai',
    'postgres',
    'sql123',
    {
        host: 'localhost',
        port: '5432',
        dialect: 'postgres'
    }
);
module.exports = sequelize;