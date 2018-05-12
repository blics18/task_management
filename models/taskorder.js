'use strict';
module.exports = (sequelize, DataTypes) => {
  var taskOrder = sequelize.define('taskOrder', {
    taskArray: DataTypes.ARRAY(DataTypes.STRING)
  }, {});
  taskOrder.associate = function(models) {
    // associations can be defined here
  };
  return taskOrder;
};
