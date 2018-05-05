'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('taskUsers', [{
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'demo@demo.com',
        password: 'demo'
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('taskUsers', null, {});
  }
};
