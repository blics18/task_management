'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('taskOrders', {
      taskArray: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      categoryId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('taskOrders');
  }
};
