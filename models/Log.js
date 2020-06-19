const mongoose = require('mongoose');

const LogSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  serviceDescription: {
    type: String,
    required: true
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  conclusion: {
    type: Boolean,
    default: false
  },
  dateConclusion: {
    type: Date
  }
});

module.exports = mongoose.model('logs', LogSchema);
