'use strict';
var express = require('express');
var db = require('../models/index');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('auth');
});

router.post('/register', function(req, res){
  db.sequelize.query('INSERT INTO "taskUsers" ("firstName", "lastName", email, password) VALUES ( :firstName, :lastName, :email, :password )', {replacements: { firstName: req.body.firstName.trim(), lastName: req.body.lastName.trim(), email: req.body.email.trim(), password: req.body.password.trim()}, type: db.sequelize.QueryTypes.INSERT, returning: true, plain: true})
  .then(function(result){
    if (result[1]){
      db.sequelize.query('SELECT * FROM "taskUsers" WHERE email=:email', {replacements: {email: req.body.email.trim()}, type: db.sequelize.QueryTypes.SELECT, returning: true, plain: true})
      .then(sessionUser => {
        console.log("USER ", sessionUser);
        req.session.user = sessionUser;
        res.status(200).redirect('/home');
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

router.post('/login', function(req, res){
  // sequelize.query("SELECT * FROM task_user WHERE task_user.email=" + req.body.email.trim() + " AND task_user.password=" + req.body.password.trim(), {type: sequelize.QueryTypes.SELECT})
  db.sequelize.query("SELECT * FROM taskUsers", {type: db.sequelize.QueryTypes.SELECT})
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
