var express = require('express');
var auth = require('../utils/requireLogin');
var db = require('../models/index');
var router = express.Router();

router.use(auth.requireLogin);

var categoryId;

router.get('/:boardName/board-id/:boardId', function(req, res, next) {
  //load user's categories
  db.sequelize.query('SELECT * FROM categories WHERE "boardId"=:boardId', {replacements: {boardId: req.params.boardId}, type: db.sequelize.QueryTypes.SELECT})
  .then(function(categories){
    categoryId = categories;
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

//TODO ISSUE
// function queryTask(taskArray, res){
//   var tasks = [];
//   for (i = 0; i < taskArray.length; i++){
//       promise = new Promise((resolve, reject) => {
//
//       db.sequelize.query('SELECT * FROM tasks WHERE "taskId"=:taskId', {replacements: {taskId: taskArray[i]}, type: db.sequelize.QueryTypes.SELECT})
//       .then(function(task){
//         // tasks.push(task[0]);
//         resolve(task[0]);
//       })
//       .catch(function(err){
//         reject(err);
//         res.status(500).send(err);
//         return console.error(err);
//       })
//     })
//     tasks.push(promise);
//   }
//
//
//     Promise.all(tasks).then(function(tasks){
//       console.log("RESOLVE HERE ", tasks);
//       return new Promise((resolve, reject) => {
//         resolve(tasks);
//     })
//   })
// }

function queryTask(taskArray, res){
  var tasks = [];

  return new Promise((resolve, reject) => {
    for (i = 0; i < taskArray.length; i++){
      db.sequelize.query('SELECT * FROM tasks WHERE "taskId"=:taskId', {replacements: {taskId: taskArray[i]}, type: db.sequelize.QueryTypes.SELECT})
      .then(function(task){
        // tasks.push(task[0]);
        resolve(task[0]);
      })
      .catch(function(err){
        reject(err);
        res.status(500).send(err);
        return console.error(err);
      })
    }
  })
}

//TODO ISSUE
function queryTaskOrder(res){
  var taskMap = new Map();
  return new Promise((resolve, reject) => {
    for (i = 0; i < categoryId.length; i++){
      db.sequelize.query('SELECT "taskArray" FROM "taskOrders" WHERE "categoryId"=:categoryId', {replacements: {categoryId: categoryId[i].categoryId}, type: db.sequelize.QueryTypes.SELECT})
      .then(function(taskArray){
        console.log("taskArray ------> ", taskArray);
        const taskPromise = queryTask(taskArray[0].taskArray, res);
        taskPromise.then(task =>{
            // if (taskMap.get(task.categoryId)){
            //   taskMap.get(task.categoryId).push(task.task);
            //   console.log("TASKMAP HERE ----> ", taskMap);
            // }else{
            //   var tasks = [];
            //   tasks.push(task);
            //   taskMap.set(task.categoryId, tasks);
            //   console.log("TASKMAP ----> ", taskMap);
            // }
            taskMap.set(task.categoryId, task);
            console.log("TASKMAP ----> ", taskMap);
        })
        .catch(err =>{
          console.log(err);
        })
      })
      .catch(function(err){
        reject(err);
        res.status(500).send(err);
        return console.error(err);
      })
    }
    resolve(taskMap);
  })
}

//TODO ISSUE
router.get('/:boardId/task/load', function(req, res){
    const taskOrderPromise = queryTaskOrder(res);
    taskOrderPromise.then(taskMap =>{
      res.json(taskMap);
    })
    .catch(err => {
      console.log(err);
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
        if (updateResult[1]){
          db.sequelize.query('SELECT * FROM categories WHERE "categoryId"=:categoryId', {replacements: {categoryId: req.params.categoryId}, type: db.sequelize.QueryTypes.SELECT})
          .then(function(newTitle){
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
router.post('/:boardId/category/:categoryId/task', function(req, res){
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
});

//update categoryId for a task
router.put('/:boardId/category/:categoryId/task/:taskId', function(req, res){
  db.sequelize.query('UPDATE tasks SET "categoryId"=:categoryId WHERE "taskId"=:taskId', {replacements: {categoryId: req.params.categoryId, taskId: req.params.taskId}, type: db.sequelize.QueryTypes.UPDATE})
  .then(function(result){
    res.end();
  })
  .catch(function(err){
    res.status(500).send(err);
    return console.error(err);
  })
});

//insert list of task ids to keep order
router.post('/:boardId/category/:categoryId/task/order', function(req, res){
  db.sequelize.query('SELECT * FROM "taskOrders" WHERE "categoryId"=:categoryId', {replacements: {categoryId: req.params.categoryId}, type: db.sequelize.QueryTypes.SELECT})
  .then(function(result){
    if (result.length == 0){
      db.sequelize.query('INSERT INTO "taskOrders" ("categoryId", "taskArray") VALUES (:categoryId, ARRAY[:taskArray])', {replacements: {categoryId: req.params.categoryId, taskArray: req.body.array.map(Number)}, type: db.sequelize.QueryTypes.INSERT})
      .then(function(arrayResult){
        res.end();
      })
      .catch(function(err){
        res.status(500).send(err);
        return console.error(err);
      })
    }else{
      db.sequelize.query('UPDATE "taskOrders" SET "taskArray"=ARRAY[:taskArray] WHERE "categoryId"=:categoryId', {replacements: {categoryId: req.params.categoryId, taskArray: req.body.array.map(Number)}, type: db.sequelize.QueryTypes.UDPATE})
      .then(function(arrayResult){
        res.end();
      })
      .catch(function(err){
        res.status(500).send(err);
        return console.error(err);
      });
    }
  })
  .catch(function(err){
    res.status(500).send(err);
    return console.error(err);
  });
});
module.exports = router;
