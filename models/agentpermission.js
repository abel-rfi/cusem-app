'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class agentPermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  agentPermission.init({
    roles: DataTypes.STRING,
    customerCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'agentPermission',
  });
  return agentPermission;
};