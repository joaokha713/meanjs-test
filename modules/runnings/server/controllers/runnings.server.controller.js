'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Running = mongoose.model('Running'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an running
 */
exports.create = function (req, res) {
  var running = new Running(req.body);
  running.user = req.user;

  running.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(running);
    }
  });
};

/**
 * Show the current running
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var running = req.running ? req.running.toJSON() : {};

  // Add a custom field to the Running, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Running model.
  running.isCurrentUserOwner = !!(req.user && running.user && running.user._id.toString() === req.user._id.toString());

  res.json(running);
};

/**
 * Update an running
 */
exports.update = function (req, res) {
  var running = req.running;

  running.distance = req.body.distance;
  running.duration = req.body.duration;
  running.date = req.body.date;

  running.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(running);
    }
  });
};

/**
 * Delete an running
 */
exports.delete = function (req, res) {
  var running = req.running;

  running.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(running);
    }
  });
};

/**
 * List of Runnings
 */
exports.list = function (req, res) {
  var where = {};
  if (req.user.roles.indexOf('admin') === -1) {
    where = {};
  }

  Running.find().sort('-created').populate('user', 'displayName').exec(function (err, runnings) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(runnings);
    }
  });
};

/**
 * Running middleware
 */
exports.runningByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Record is invalid'
    });
  }

  Running.findById(id).populate('user', 'displayName').exec(function (err, running) {
    if (err) {
      return next(err);
    } else if (!running) {
      return res.status(404).send({
        message: 'No record with that identifier has been found'
      });
    }

    if (req.user.roles.indexOf('admin') === -1 && !running.user.equals(req.user._id)) {
      return res.status(403).json({
        message: 'User is not authorized'
      });
    }

    req.running = running;
    next();
  });
};
