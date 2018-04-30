'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('boards', {
      boardId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      boardName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      //foreignKey
      userId:{
        type: Sequelize.INTEGER,
        references: {
            model: 'taskUsers',
            key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('boards');
  }
};
