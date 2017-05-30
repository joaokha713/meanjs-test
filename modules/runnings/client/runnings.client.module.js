(function (app) {
  'use strict';

  app.registerModule('runnings', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('runnings.services');
  app.registerModule('runnings.routes', ['ui.router', 'core.routes', 'runnings.services']);
}(ApplicationConfiguration));
