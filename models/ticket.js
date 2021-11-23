'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Ticket.init({
    emplId: DataTypes.INTEGER,
    custId: DataTypes.INTEGER,
    complaintStatus: DataTypes.STRING,
    complaintCategory: DataTypes.STRING,
    passedFor: DataTypes.INTEGER,
    passedFrom: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Ticket',
  });
  return Ticket;
};