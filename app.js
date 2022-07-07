var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var passport = require("passport");
var config = require("./config");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var imagenRouter = require("./routes/uploadImage");
var searchRouter = require('./routes/search');
var notificationsRouter = require('./routes/notifications');
var commentRouter = require('./routes/commentsRouter');
var likesRouter = require('./routes/likesRouter');
var inboxRouter = require('./routes/inboxRouter');
var outlineRouter = require('./routes/outlineRouter');
var startRouter = require('./routes/startRouter');
var storyRouter = require('./routes/storyRouter');
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

//MongoDB
const url = config.mongoUrl;
const connect = mongoose.connect(url);
connect.then(
  db => {
    console.log("Connected correctly to MongoDB");
  },
  err => {
    console.log(err);
  }
);
var app = express();


// Secure traffic only
app.all("*", (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(
      307,
      "https://" + req.hostname + ":" + app.get("secPort") + req.url
    );
  }
});

//MIDDLEWARES
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.all(['/', '/userpage', '/settings', '/inbox', '/profiles'], (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});


//Authentication
app.use('/', indexRouter);
app.use(passport.initialize());


app.use('/users', usersRouter);
app.use('/start', startRouter);
app.use('/story', storyRouter);
app.use('/imagen', imagenRouter);
app.use('/search', searchRouter);
app.use('/notification', notificationsRouter);
app.use('/comments', commentRouter);
app.use('/likes', likesRouter);
app.use('/inbox-message', inboxRouter.routerInd);
app.use('/out-auth', outlineRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
