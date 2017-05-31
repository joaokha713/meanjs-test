(function () {
  'use strict';

  angular
    .module('runnings.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('runnings', {
        abstract: true,
        url: '/runnings',
        template: '<ui-view/>'
      })
      .state('runnings.list', {
        url: '',
        templateUrl: '/modules/runnings/client/views/list-runnings.client.view.html',
        controller: 'RunningsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('runnings.report', {
        url: '/reports',
        templateUrl: '/modules/runnings/client/views/weekly-report.client.view.html',
        controller: 'RunningReportController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('runnings.create', {
        url: '/create',
        templateUrl: '/modules/runnings/client/views/form-running.client.view.html',
        controller: 'RunningsController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        },
        resolve: {
          runningResolve: newRunning
        }
      })
      .state('runnings.edit', {
        url: '/:runningId/edit',
        templateUrl: '/modules/runnings/client/views/form-running.client.view.html',
        controller: 'RunningsController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        },
        resolve: {
          runningResolve: getRunning
        }
      });
  }

  getRunning.$inject = ['$stateParams', 'RunningsService'];

  function getRunning($stateParams, RunningsService) {
    return RunningsService.get({
      runningId: $stateParams.runningId
    }).$promise;
  }

  newRunning.$inject = ['RunningsService'];

  function newRunning(RunningsService) {
    return new RunningsService();
  }
}());
