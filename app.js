var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('config');

var routes = require('./routes/index');
var quest = require('./routes/quest');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/favicon.ico'));
//app.use(logger('dev'));
if (app.get('env') == 'development') {
    app.use(logger('dev'));
} else {
    app.use(logger('default'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: true,
    rolling: true,
    secret: config.get('session:secret') // ABCDE242342342314123421.SHA256
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/quest', quest);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
