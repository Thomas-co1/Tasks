const sequelize = require('../core/orm.js');
const { DataTypes } = require('sequelize');

const Tag = sequelize.define('Tag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, 
{
    timestamps: true
});

module.exports = Tag;