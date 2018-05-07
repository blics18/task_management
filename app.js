var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');
var db = require('./models/index');


var index = require('./routes/index');
var users = require('./routes/users');
var board = require('./routes/board');
var auth = require('./routes/auth');
var home = require('./routes/home');
var userSession = require('./cookieConfig');

var app = express();


// client-sessions
app.use(session(userSession));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  if (req.session && req.session.user){
    db.sequelize.query('SELECT * FROM "taskUsers" WHERE id= :id', {replacements: {id: req.session.user.id}, type: db.sequelize.QueryTypes.SELECT})
    .then(user => {
      if (user.length != 0){
        req.user = user[0];
        delete req.user.password;
        req.session.user = user[0];
        res.locals.user = user[0];
      }
      next();
    })
    .catch(err =>{
      res.status(500).send(err);
      return console.error(err);
    });
  }else{
    next();
  }
});

app.use('/auth', auth);
app.use('/users', users);
app.use('/home', home);
app.use('/board', board);
app.use('/', index);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(process.env.NODE_ENV)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
