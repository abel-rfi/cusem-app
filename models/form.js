'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class form extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  form.init({
    ticketId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    message: DataTypes.TEXT,
    complaintStatus: DataTypes.STRING,
    complaintCategory: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'form',
  });
  return form;
};