'use strict';
var express = require('express');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('auth');
});

router.post('/register', function(req, res){
  db.sequelize.query("INSERT INTO task_user VALUES ('" + req.body.firstName.trim() +  "', '" + req.body.lastName.trim() + "', '" + req.body.email.trim() + "', '" +  req.body.password.trim() + "', NOW(), NOW())", { type: sequelize.QueryTypes.INSERT})
  .then(function(user){
    console.log("USER REG", user);
      // req.session.user = user;
      res.status(200).redirect('/home');
  })
  .catch(function(err){
    res.status(500).send(err);
    return console.error(err);
  });
});

router.post('/login', function(req, res){
  // sequelize.query("SELECT * FROM task_user WHERE task_user.email=" + req.body.email.trim() + " AND task_user.password=" + req.body.password.trim(), {type: sequelize.QueryTypes.SELECT})
  sequelize.query("SELECT * FROM task_user", {type: sequelize.QueryTypes.SELECT})
  .then(function(user){
    console.log("USER", user);
    res.status(200).redirect('/home');
  })
  .catch(function(err){
    res.status(500).send(err);
    return console.error(err);
  });
});



module.exports = router;
