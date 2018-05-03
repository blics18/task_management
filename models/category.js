'use strict';
module.exports = (sequelize, DataTypes) => {
  var category = sequelize.define('category', {
    categoryName: DataTypes.STRING,
    boardId: DataTypes.INTEGER
  }, {});
  category.associate = function(models) {
    // associations can be defined here
    category.belongsTo(models.board);
    category.hasMany(models.task);
  };
  return category;
};
