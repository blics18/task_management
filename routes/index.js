var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/auth');
});


router.get('/logout', function(req, res){
  req.session.reset();
  res.redirect('/auth');
});


module.exports = router;
