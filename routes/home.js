var express = require('express');
var auth = require('../utils/requireLogin');
var db = require('../models/index');
var router = express.Router();

router.use(auth.requireLogin);

router.get('/', function(req, res, next){
  //load users boards
  db.sequelize.query('SELECT * FROM boards WHERE "userId"=:userid', {replacements: {userid: req.user.id}, type: db.sequelize.QueryTypes.SELECT})
  .then(function(boards){
    res.render('home', {
      boards: boards
    });
  })
  .catch(function(err){
    res.status(500).send(err);
    return console.error(err);
  });

});

//add new board title into database
router.post('/board/add', function(req, res){
  db.sequelize.query('SELECT * FROM boards WHERE "userId"=:userid AND "boardName"= :boardName', {replacements: {userid: req.user.id, boardName: req.body.boardTitle.trim()}, type: db.sequelize.QueryTypes.SELECT})
  .then(function(result){
    if (result.length == 0){ //no duplicate board name for one user
      db.sequelize.query('INSERT INTO boards ("boardName", "userId") VALUES (:boardName, :userid)', {replacements: {boardName: req.body.boardTitle.trim(), userid: req.user.id }, type: db.sequelize.QueryTypes.INSERT})
      .then(function(boardResult){
        if (boardResult[1]){
          db.sequelize.query('SELECT * FROM boards WHERE "userId"=:userid AND "boardName"= :boardName', {replacements: {userid: req.user.id, boardName: req.body.boardTitle.trim()}, type: db.sequelize.QueryTypes.SELECT})
          .then(function(board){
            res.send(JSON.stringify(board[0]));
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
          err: `Board Name (${req.body.boardTitle.trim()}) already exists. Enter another`
      }
      res.send(JSON.stringify(err));
    }
  })
  .catch(function(err){
    res.status(500).send(err);
    return console.error(err);
  })
});

//delete board
router.delete('/board/:boardId/delete', function(req, res){
  db.sequelize.query('DELETE FROM boards WHERE "boardId"=:boardId', {replacements: {boardId: req.params.boardId}, type: db.sequelize.QueryTypes.DELETE})
  .then(function(result){
    res.end();
  })
  .catch(function(err){
    res.status(500).send(err);
    return console.error(err);
  });

});

//update board title
router.put('/board/:boardId/update', function(req, res){
  db.sequelize.query('SELECT * FROM boards WHERE "userId"=:userid AND "boardName"= :boardName', {replacements: {userid: req.user.id, boardName: req.body.boardTitle.trim()}, type: db.sequelize.QueryTypes.SELECT})
  .then(function(result){
    if (result.length == 0){ //no duplicate board name for one user
      db.sequelize.query('UPDATE boards SET "boardName"=:boardName WHERE "boardId"=:boardId', {replacements: {boardName: req.body.boardTitle.trim(), boardId: req.params.boardId}, type: db.sequelize.QueryTypes.UPDATE})
      .then(function(result){
        if (result[1]){
          db.sequelize.query('SELECT * FROM boards WHERE "boardId"=:boardId', {replacements: {boardId: req.params.boardId}, type: db.sequelize.QueryTypes.SELECT})
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
        err: `Board Name (${req.body.boardTitle.trim()}) already exists. Enter another`
      }
      res.send(JSON.stringify(err));
    }
  })
  .catch(function(err){
    res.status(500).send(err);
    return console.error(err);
  })
});



module.exports = router;
