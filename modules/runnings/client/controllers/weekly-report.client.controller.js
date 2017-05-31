(function () {
  'use strict';

  angular
    .module('runnings')
    .controller('RunningReportController', RunningReportController);

  RunningReportController.$inject = ['RunningsService'];

  function RunningReportController(RunningsService) {
    var vm = this;
    RunningsService.weeklyReports(function(reports) {
      console.log(reports);
      vm.reports = reports;
    });
  }
}());
