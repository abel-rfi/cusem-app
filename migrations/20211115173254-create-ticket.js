'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      emplId: {
        type: Sequelize.INTEGER
      },
      custId: {
        type: Sequelize.INTEGER
      },
      complaintStatus: {
        type: Sequelize.STRING
      },
      complaintCategory: {
        type: Sequelize.STRING
      },
      ticketType: {
        type: Sequelize.STRING
      },
      passedFor: {
        type: Sequelize.INTEGER
      },
      passedFrom: {
        type: Sequelize.STRING
      },
      roomName: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Tickets');
  }
};