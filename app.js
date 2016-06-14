var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var uuid = require('uuid');
var MongoClient = require('mongodb').MongoClient;

var app = express();

var connectionString = 'mongodb://localhost:27017/AcidRefluxStore'
var db;

MongoClient.connect(connectionString, function(err, dbCon) {
  if (err) {
    console.error('Unable to connect to MognoDB');
  } else {
    db = dbCon;
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  req.db = db;
  next();
});

app.use(function(req, res, next) {
  console.log('ORIGINALURL: ', req.originalUrl);
  console.log('HOSTNAME: ', req.hostname);
  console.log('IP: ', req.ip);
  console.log('IPS: ', req.ips);
  console.log('PROTOCOL: ', req.protocol);
  console.log('XHR: ', req.xhr);
  console.log('METHOD: ', req.method);
  console.log('COOKIES: ', req.cookies);
  console.log('SIGNEDCOOKIES: ', req.signedCookies);
  console.log('QUERY: ', req.query);
  console.log('PARAMS: ', req.params);
  console.log('HEADERS: ');
  console.log(req.headers);
  console.log('BODY: ');
  console.log(req.body);
  console.log('\n\n');

  var request = {
    id: uuid.v4(),
    request: {
      originalurl: req.originalUrl,
      hostname: req.hostname,
      ip: req.ip,
      ips: req.ips,
      protocol: req.protocol,
      xhr: req.xhr,
      method: req.method,
      cookies: req.cookies,
      signedcookies: req,signedCookies,
      querry: req.query,
      params: req.params,
      headers: req.headers,
      body: req.body
    }
  }
  if (req.db) {
    var requests = req.db.collection('requests');
    requests.insertOne(request, function(err, doc) {
      if (err) {
         console.log('Error occurred when saving the document: ', err);
      } else {
        console.log('Request saved!');
      }
    });
  }

  return res.json(request);
});
//app.use('/', routes);

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
 // var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//      message: err.message,
//      error: err
//    });
//  });
//}

module.exports = app;
