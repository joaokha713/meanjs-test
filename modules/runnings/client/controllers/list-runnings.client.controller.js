(function () {
  'use strict';

  angular
    .module('runnings')
    .controller('RunningsListController', RunningsListController);

  RunningsListController.$inject = ['RunningsService', '$scope'];

  function RunningsListController(RunningsService, $scope) {
    var vm = this;
    vm.runnings = RunningsService.query(function() {
      vm.filteredRunnings = angular.copy(vm.runnings);
    });

    vm.startDate = '';
    vm.endDate = '';
    vm.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    vm.datepicker = {
      startDateOpened: false,
      endDateOpened: false
    };
    vm.openDatepicker = function(picker) {
      vm.datepicker[picker + 'Opened'] = true;
    };

    vm.filter = function() {
      return false;
    };

    $scope.$watch(function () {
      return vm.startDate.toString() + vm.endDate.toString();
    }, function() {
      vm.filteredRunnings = vm.runnings.filter(function(running) {
        if (vm.startDate && moment(vm.startDate).diff(running.date) > 0) {
          return false;
        }

        if (vm.endDate && moment(vm.endDate).diff(running.date) < 0) {
          return false;
        }
        return true;
      });
    });
  }
}());
