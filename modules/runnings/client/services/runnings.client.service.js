(function () {
  'use strict';

  angular
    .module('runnings.services')
    .factory('RunningsService', RunningsService);

  RunningsService.$inject = ['$resource', '$log'];

  function RunningsService($resource, $log) {
    var Running = $resource('/api/runnings/:runningId', {
      runningId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Running.prototype, {
      createOrUpdate: function () {
        var running = this;
        return createOrUpdate(running);
      }
    });

    return Running;

    function createOrUpdate(running) {
      if (running._id) {
        return running.$update(onSuccess, onError);
      } else {
        return running.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(running) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
