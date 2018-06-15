var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session')
var MongoStore = require('connect-mongo')(session);

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/4201')
  .then(() => console.log('connection successful'))
  .catch((err) => console.error(err));

var book = require('./routes/book');
var app = express();

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
 }));

app.use(function(req, res, next) {
  // if (!req.session.views) {
  //   req.session.views = {}
  // }
  //
  // // get the url pathname
  // var pathname = 'test'
  //
  // // count the views
  // req.session.views[pathname] = (req.session.views[pathname] || 0) + 1
  // console.log(req.session.views)
  next()
})

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  'extended': 'false'
}));

app.use(express.static(path.join(__dirname, 'dist/nodeAng')));
app.use('/foo', express.static(path.join(__dirname, 'dist/nodeAng')));
// app.use('/foo', function(req, res, next) {
//
// });


app.use('/book', book);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
