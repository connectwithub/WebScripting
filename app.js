var createError = require('http-errors');
var express = require('express');                     
var path = require('path');
var config  = require('./config/config');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var indexDownloadRouter = require('./routes/indexDownload');
var indexUploadRouter = require('./routes/indexUpload');
var indexDatabaseRouter = require('./routes/indexDatabase');

const getResults = require("./util/scraper");
const stdown = require("./controller/downn.js");
const upload = require("./util/upload");
var dbconnect = require('./mongodbase/databs');
const dbstore = require('./mongodbase/storeData_db');
const dbFind = require('./mongodbase/dbfind');


var app = express();
console.log(1);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(logger('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

/*app.get('/getAllBooks/', async function(req, res){
  new dbconnect();
  console.log("Request path : ", req.originalUrl);
  const result = await getResults();
  //res.render("index", result);
  const dbf= await dbFind();
  res.json(dbf);
  
});*/


app.use('/download', indexDownloadRouter);
app.use('/upload', indexUploadRouter);
app.use('/dbstore', indexDatabaseRouter);
app.use('/api/classdashboard/subjectdashboard', indexDatabaseRouter);





/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
*/
const port = config.server.port;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
