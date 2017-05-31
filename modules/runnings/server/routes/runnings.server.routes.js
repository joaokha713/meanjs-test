'use strict';

/**
 * Module dependencies
 */
var runningsPolicy = require('../policies/runnings.server.policy'),
  runnings = require('../controllers/runnings.server.controller');

module.exports = function (app) {
  // Runnings collection routes
  app.route('/api/runnings').all(runningsPolicy.isAllowed)
    .get(runnings.list)
    .post(runnings.create);

  // Runnings collection routes
  app.route('/api/runnings/reports').all(runningsPolicy.isAllowed)
    .get(runnings.weeklyReport);

  // Single running routes
  app.route('/api/runnings/:runningId').all(runningsPolicy.isAllowed)
    .get(runnings.read)
    .put(runnings.update)
    .delete(runnings.delete);

  // Finish by binding the running middleware
  app.param('runningId', runnings.runningByID);
};
