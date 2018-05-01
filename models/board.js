'use strict';
module.exports = (sequelize, DataTypes) => {
  var board = sequelize.define('board', {
    boardName: DataTypes.STRING
  }, {});
  board.associate = function(models) {
    // associations can be defined here
    board.belongsTo(models.taskUser);
    board.hasMany(models.category);
  };
  return board;
};
