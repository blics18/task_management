'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('taskUsers', [{
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
