const express = require('express');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');

const app = express();

// Passport config
require('./config/passport')(passport);

// Connect Database
connectDB();

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/logs', require('./routes/logs'));

// Listen and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
