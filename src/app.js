const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session')
require('dotenv').config(); 
const flash = require('connect-flash');
const cors = require('cors');

const { SECRET } = process.env;


require('./db.js');
require('./passport/local-auth');


const server = express();

server.name = 'DESAFIO';

// Settings


// Middlewares
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));
//PASSPORT
server.use(express.urlencoded({extended: false}));
server.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: false
}));
server.use(flash());
server.use(passport.initialize());
server.use(passport.session());
// ACCESO A LA API
server.use(cors());
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); 
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept'); 
  next();
});

const corsOptions = {
  origin:  'http://localhost:5173',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

server.use(cors(corsOptions));

server.use((req, res , next) => {
  server.locals.signupMessage = req.flash("signupMessage")
  server.locals.signinMessage = req.flash("signinMessage")
  next()
})

// Routes
server.use('/', require('./routes/index'));


server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;