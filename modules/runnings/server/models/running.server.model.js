'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var validateDistance = function(distance) {
  return distance > 0;
};

var validateDuration = function(duration) {
  return duration > 0;
};

/**
 * Running Schema
 */
var RunningSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  date: {
    type: Date
  },
  duration: {
    type: Number,
    default: 0,
    validate: [validateDuration, 'Duration should be bigger than 00:00']
  },
  distance: {
    type: Number,
    default: 0,
    validate: [validateDistance, 'Distance should be bigger than 0km']
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Running', RunningSchema);
