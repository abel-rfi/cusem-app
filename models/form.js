'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Form extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Form.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false
    },
    ticketId: DataTypes.UUID,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    message: DataTypes.TEXT,
    complaintStatus: DataTypes.STRING,
    complaintCategory: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Form',
  });
  return Form;
};