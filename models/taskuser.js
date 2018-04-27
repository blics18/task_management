'use strict';
module.exports = (sequelize, DataTypes) => {
  var taskUser = sequelize.define('taskUser', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  taskUser.associate = function(models) {
    // associations can be defined here
  };
  return taskUser;
};
