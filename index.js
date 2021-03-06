const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

//Model imports

const Festival = require('./models').Festival;

//Application instantiation 
const app = express();

// Setting up mongoose
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capstone-project');
const db = mongoose.connection;

db.on('error', error => {
  console.log('Connection error:', error);
});

db.once('open', () => {
  console.log('Db connection successful');
});

//Setting up promises in mongoose
mongoose.Promise = global.Promise;

//Adding body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Adding sessions
app.use(session({
    secret: 'Capstone project',
    resave: true,
    saveUninitialized: false
  }));

//Making the currently logged in user available to all our templates
app.use( (req, res, next) => {
  res.locals.currentUser = req.session.userId;
  next();
});

//Importing and setting route handlers

const festivals = require('./routes/festivals');
const users = require('./routes/users');

app.use('/festivals', festivals);
app.use('/users', users);

//Accessing static server
app.use('/static', express.static('public'));

//Setting pug as view engine
app.set('view engine', 'pug');

app.get('/', (req, res, next) => {
  //Retrieving festivals from the db 
  Festival.find({})
          .exec( function(error, festivals){
            if(error){
              return next(error);
            } else{
              res.render('home', {festivals: festivals});
            }
          });
});

//Renders about page
app.get('/about', (req, res, next) => {
  res.render('about');
})

//Catch 404 error and forward to error handler
app.use( (req, res, next) => {
  let error = new Error('Not found');
  error.status = 404;
  next(error);
})

//Error handling widdleware
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

let port = process.env.PORT || 3001;
  
//Setting up app on port 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});