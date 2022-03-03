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
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false
    },
    emplId: DataTypes.UUID,
    custId: DataTypes.UUID,
    complaintStatus: DataTypes.STRING,
    complaintCategory: DataTypes.STRING,
    ticketType: DataTypes.STRING,
    passedFor: DataTypes.INTEGER,
    passedTo: DataTypes.STRING,
    passedFrom: DataTypes.STRING,
    roomName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Ticket',
  });
  Ticket.associate = function(models) {
    Ticket.belongsTo(models.User, {
      foreignKey: 'custId',
      as: 'user'
    })

    Ticket.belongsTo(models.Employee, {
      foreignKey: 'emplId',
      as: 'employee'
    })

    Ticket.belongsTo(models.Employee, {
      foreignKey: 'passedTo',
      as: 'employeeRecv'
    })

    Ticket.belongsTo(models.Employee, {
      foreignKey: 'passedFrom',
      as: 'employeeReq'
    })
  }
  return Ticket;
};