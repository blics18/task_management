'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('categories', {
      categoryId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      categoryName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      //foreignKey
      boardId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'boards',
          key: 'boardId'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('categories');
  }
};
