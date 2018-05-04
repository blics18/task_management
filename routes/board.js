var express = require('express');
var auth = require('../utils/requireLogin');
var db = require('../models/index');
var router = express.Router();

router.use(auth.requireLogin);


router.get('/:boardName/board-id/:boardId', function(req, res, next) {
  //load user's categories
  db.sequelize.query('SELECT * FROM categories WHERE "boardId"=:boardId', {replacements: {boardId: req.params.boardId}, type: db.sequelize.QueryTypes.SELECT})
  .then(function(categories){
    res.render('board', {
      categories: categories,
      boardName: req.params.boardName,
      boardId: req.params.boardId
    });
  })
  .catch(function(err){
    res.status(500).send(err);
    return console.error(err);
  })
});

//add category
router.post('/:boardId/category', function(req, res){
  db.sequelize.query('SELECT * FROM categories WHERE "boardId"=:boardId AND "categoryName"= :categoryName', {replacements: {boardId: req.params.boardId, categoryName: req.body.categoryTitle.trim()}, type: db.sequelize.QueryTypes.SELECT})
  .then(function(result){
    if (result.length == 0){ //no duplicate category name in a board
      db.sequelize.query('INSERT INTO categories ("categoryName", "boardId") VALUES (:categoryName, :boardId)', {replacements: {categoryName: req.body.categoryTitle.trim(), boardId: req.params.boardId }, type: db.sequelize.QueryTypes.INSERT})
      .then(function(categoryResult){
        if (categoryResult[1]){
          db.sequelize.query('SELECT * FROM categories WHERE "boardId"=:boardId AND "categoryName"= :categoryName', {replacements: {boardId: req.params.boardId, categoryName: req.body.categoryTitle.trim()}, type: db.sequelize.QueryTypes.SELECT})
          .then(function(category){
            res.send(JSON.stringify(category[0]));
          })
          .catch(function(err){
            res.status(500).send(err);
            return console.error(err);
          })
        }else{
          res.status(500).send(err);
          return console.error(err);
        }
      })
      .catch(function(err){
        res.status(500).send(err);
        return console.error(err);
      })
    }else{
      err = {
          err: `Category Name (${req.body.categoryTitle.trim()}) already exists. Enter another`
      }
      res.send(JSON.stringify(err));
    }
  })
  .catch(function(err){
    res.status(500).send(err);
    return console.error(err);
  })
});

//delete category
router.delete('/:boardId/category/:categoryId', function(req, res){
  db.sequelize.query('DELETE FROM categories WHERE "categoryId"=:categoryId', {replacements: {categoryId: req.params.categoryId}, type: db.sequelize.QueryTypes.DELETE})
  .then(function(result){
    res.end();
  })
  .catch(function(err){
    res.status(500).send(err);
    return console.error(err);
  });
});

//update category title
router.put('/:boardId/category/:categoryId', function(req, res){
  db.sequelize.query('SELECT * FROM categories WHERE "boardId"=:boardId AND "categoryName"= :categoryName', {replacements: {boardId: req.params.boardId, categoryName: req.body.categoryTitle.trim()}, type: db.sequelize.QueryTypes.SELECT})
  .then(function(result){
    if (result.length == 0){ //no duplicate category name for one user
      db.sequelize.query('UPDATE categories SET "categoryName"=:categoryName WHERE "categoryId"=:categoryId', {replacements: {categoryName: req.body.categoryTitle.trim(), categoryId: req.params.categoryId}, type: db.sequelize.QueryTypes.UPDATE})
      .then(function(updateResult){
        console.log("UPDATE RESULT ", updateResult);
        if (updateResult[1]){
          db.sequelize.query('SELECT * FROM categories WHERE "categoryId"=:categoryId', {replacements: {categoryId: req.params.categoryId}, type: db.sequelize.QueryTypes.SELECT})
          .then(function(newTitle){
            console.log("NEW TITLE ", newTitle);
            res.send(JSON.stringify(newTitle[0]));
          })
          .catch(function(err){
            res.status(500).send(err);
            return console.error(err);
          })
        }
      })
      .catch(function(err){
        res.status(500).send(err);
        return console.error(err);
      })
    }else{
      err = {
        err: `Category Name (${req.body.categoryTitle.trim()}) already exists. Enter another`
      }
      res.send(JSON.stringify(err));
    }
  })
  .catch(function(err){
    res.status(500).send(err);
    return console.error(err);
  })
});

//add task to a category
router.put('/:boardId/category/:categoryId/task', function(req, res){
  db.sequelize.query('SELECT * FROM tasks WHERE "categoryId"=:categoryId AND "taskName"= :taskName', {replacements: {categoryId: req.params.categoryId, taskName: req.body.taskDescription.trim()}, type: db.sequelize.QueryTypes.SELECT})
  .then(function(result){
    if (result.length == 0){ //no duplicate task for one user
      db.sequelize.query('INSERT INTO tasks ("taskName", "categoryId") VALUES (:taskName, :categoryId)', {replacements: {taskName: req.body.taskDescription.trim(), categoryId: req.params.categoryId }, type: db.sequelize.QueryTypes.INSERT})
      .then(function(taskResult){
        db.sequelize.query('SELECT * FROM tasks WHERE "categoryId"=:categoryId AND "taskName"= :taskName', {replacements: {categoryId: req.params.categoryId, taskName: req.body.taskDescription.trim()}, type: db.sequelize.QueryTypes.SELECT})
        .then(function(task){
          res.json(task[0]);
        })
        .catch(function(err){
          res.status(500).send(err);
          return console.error(err);
        });
      })
      .catch(function(err){
        res.status(500).send(err);
        return console.error(err);
      })
    }else{
      res.json({ err: `Task (${req.body.taskDescription.trim()}) already exists. Enter another`});
    }
  })
  .catch(function(err){
    res.status(500).send(err);
    return console.error(err);
  })
});

//delete task from category
router.delete('/:boardId/category/:categoryId/task/:taskId', function(req, res){
  db.sequelize.query('DELETE FROM tasks WHERE "taskId"=:taskId', {replacements: {taskId: req.params.taskId}, type: db.sequelize.QueryTypes.DELETE})
  .then(function(result){
    res.end();
  })
  .catch(function(err){
    res.status(500).send(err);
    return console.error(err);
  });
})
module.exports = router;
