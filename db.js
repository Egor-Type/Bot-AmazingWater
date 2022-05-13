const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'telegram-bot',
    'root',
    'root',
    {
        host: '',
        port: '',
        dialect: 'postgres'
    }
)