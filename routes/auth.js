'use strict';
var express = require('express');
var db = require('../models/index');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('auth');
});

router.post('/register', function(req, res){
  db.sequelize.query('INSERT INTO "taskUsers" ("firstName", "lastName", email, password) VALUES ( :firstName, :lastName, :email, :password )', {replacements: { firstName: req.body.firstName.trim(), lastName: req.body.lastName.trim(), email: req.body.email.trim(), password: req.body.password.trim()}, type: db.sequelize.QueryTypes.INSERT})
  .then(function(result){
    if (result[1]){
      db.sequelize.query('SELECT * FROM "taskUsers" WHERE email=:email', {replacements: {email: req.body.email.trim()}, type: db.sequelize.QueryTypes.SELECT})
      .then(sessionUser => {
        console.log("/register user ", sessionUser);
        req.session.user = sessionUser[0];
        // res.status(200).redirect('/home');
        res.json({ redirect: '/home' });
      })
      .catch(function(err){
        res.status(500).send(err);
        return console.error(err);
      });
    }
  })
  .catch(function(err){
    // res.status(500).render('auth', {authRegError: 'Email already in use'});
    res.json({ err: 'Email already in use'});
    console.error(err);
  });
});

router.post('/login', function(req, res){
  db.sequelize.query('SELECT * FROM "taskUsers" WHERE email=:email AND password=:password', {replacements: {email: req.body.email.trim(), password: req.body.password.trim()}, type: db.sequelize.QueryTypes.SELECT})
  .then(function(user){
    if (user.length != 0){
      console.log("/login User ", user);
      req.session.user = user[0];
      // res.status(200).redirect('/home');
      res.json({ redirect: '/home' });
    }else{
      // res.render('auth', {authError: 'Incorrect Username or Password'});
      res.json({err: 'Incorrect Username or Password'});
    }
  })
  .catch(function(err){
    res.status(500).send(err);
    return console.error(err);
  });
});



module.exports = router;
