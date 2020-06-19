const express = require('express');
const moment = require('moment');
const Log = require('../models/Log');
const { ensureAuthenticated } = require('../config/auth');

const router = express.Router();

// Logs dashboard page
router.get('/', ensureAuthenticated, async (req, res) => {
  let errors = [];
  let logs = [];
  let status = req.query.status || 'opened';

  try {
    if (status === 'opened') {
      logs = await Log.find({ user: req.user.id, conclusion: false }).sort({ dateCreation: -1 });
    } else if (status === 'finished') {
      logs = await Log.find({ user: req.user.id, conclusion: true }).sort({ dateCreation: -1 });
    } else {
      logs = await Log.find({ user: req.user.id }).sort({ dateCreation: -1 });
    }

    res.render('logsdashboard', { errors, logs, moment: moment });
  } catch (error) {
    errors.push({ msg: error.message });
    res.render('logsdashboard', { errors, logs, moment: moment });
  }
});

// Insert new log page
router.get('/new', ensureAuthenticated, (req, res) => res.render('logsform'));

// Insert new
router.post('/save', ensureAuthenticated, async (req, res) => {
  const { serviceDescription, conclusion } = req.body;
  let errors = [];

  try {
    let log = new Log();
    log.user = req.user.id;
    log.dateCreation = Date.now();
    log.serviceDescription = serviceDescription;
    log.conclusion = conclusion === 'on' ? true : false;

    if (conclusion) {
      log.dateConclusion = Date.now();
    } else {
      log.dateConclusion = null;
    }

    await log.save();
    res.redirect('/logs');
  } catch (error) {
    errors.push({ msg: error.message });
    res.render('logsform', { errors, id, serviceDescription, dateCreation, dateConclusion, conclusion });
  }
});

// Update log page
router.get('/update/:id', ensureAuthenticated, async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);
    res.render('logsformupdate', { log, moment: moment });
  } catch (error) {
    res.redirect('/logs?status=opened');
  }
});

// Update log
router.post('/update', ensureAuthenticated, async (req, res) => {
  const { idLog, serviceDescription, conclusion } = req.body;
  let errors = [];

  try {
    let log = await Log.findById({ _id: idLog });
    log.serviceDescription = serviceDescription;
    log.conclusion = conclusion === 'on' ? true : false;

    if (conclusion) {
      log.dateConclusion = Date.now();
    } else {
      log.dateConclusion = null;
    }

    await log.save();
    res.redirect('/logs');
  } catch (error) {
    errors.push({ msg: error.message });
    res.render('logsform', { errors, id, serviceDescription, dateCreation, dateConclusion, conclusion });
  }
});

// Delete log page
router.get('/delete/:id', ensureAuthenticated, async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);
    res.render('logsformdelete', { log, moment: moment });
  } catch (error) {
    res.redirect('/logs?status=opened');
  }
});

// Delete log
router.post('/delete', async (req, res) => {
  const { idLog } = req.body;

  try {
    await Log.findByIdAndRemove({ _id: idLog });
    res.redirect('/logs?status=opened');
  } catch (error) {
    res.redirect('/logs?status=opened');
  }
});

module.exports = router;
