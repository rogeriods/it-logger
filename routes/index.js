const express = require('express');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const router = express.Router();

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard', { user: req.user }));

module.exports = router;
