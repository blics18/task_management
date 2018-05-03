'use strict';
module.exports = (sequelize, DataTypes) => {
  var task = sequelize.define('task', {
    categoryId: DataTypes.INTEGER,
    taskName: DataTypes.STRING
  }, {});
  task.associate = function(models) {
    // associations can be defined here
    task.belongsTo(models.category);
    
  };
  return task;
};
