'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tickets', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      emplId: {
        type: Sequelize.UUID
      },
      custId: {
        type: Sequelize.UUID
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
      passedTo: {
        type: Sequelize.STRING
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