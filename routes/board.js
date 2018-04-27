var express = require('express');
var auth = require('../utils/requireLogin');
var db = require('../models/index');
var router = express.Router();

router.use(auth.requireLogin);

router.get('/board-name/:boardName', function(req, res, next) {
  res.render('board');
});

module.exports = router;
