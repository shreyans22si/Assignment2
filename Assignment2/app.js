﻿'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoDb = require('mongodb');
var mongoose = require('mongoose');
var passport = require('passport');
var authUser = require('./Model/authUser');
var LocalStrategy = require('passport-local').Strategy;

mongoose.connect('mongodb://localhost/assignment2');

var routes = require('./routes/index');
var users = require('./routes/users');
var advertisement = require('./routes/advertisement');
var register = require('./routes/register');
var login = require('./routes/login');
var logout = require('./routes/logout');

var session = require('express-session');
const MongoStore = require('connect-mongo')(session);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secrettexthere',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/register', register);
app.use('/login', login);
app.use('/users', users);
app.use('/', advertisement);
app.use('/logout', logout);



//Serialize user
passport.serializeUser(function (user, done) {
    done(null, user.id)
});

//Deserialize user try to find username
passport.deserializeUser(function (id, done) {
    authUser.findById(id, function (err, user) {
        done(err, user);
    });
});

//Local strategy used for logging users
passport.use(new LocalStrategy(
    function (username, password, done) {
        authUser.findOne({
            username: username
        }, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            if (user.password != password) {
                return done(null, false);
            }
            return done(null, user);
        });
    }
));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
