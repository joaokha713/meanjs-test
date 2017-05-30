(function () {
  'use strict';

  angular
    .module('runnings')
    .controller('RunningsController', RunningsController);

  RunningsController.$inject = ['$scope', '$state', '$window', 'runningResolve', 'Authentication', 'Notification'];

  function RunningsController($scope, $state, $window, running, Authentication, Notification) {
    var vm = this;

    vm.running = running;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.date = moment(running.date).toDate();
    vm.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    vm.datepicker = {
      opened: false
    };
    vm.openDatepicker = function() {
      vm.datepicker.opened = true;
    };


    // Remove existing Running
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.running.$remove(function() {
          $state.go('runnings.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Record deleted successfully!' });
        });
      }
    }

    // Save Running
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.runningForm');
        return false;
      }

      // Create a new running, or update the current instance
      vm.running.date = moment(vm.date).format();
      vm.running.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('runnings.list'); // should we send the User to the list or the updated Running's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Record saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Record save error!' });
      }
    }
  }
}());
