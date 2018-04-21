var express = require('express');
var router = express.Router();

// router.use(auth.requireLogin);

router.get('/', function(req, res, next){
  res.render('home');
});

module.exports = router;
