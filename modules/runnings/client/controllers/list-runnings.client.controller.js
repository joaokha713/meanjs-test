(function () {
  'use strict';

  angular
    .module('runnings')
    .controller('RunningsListController', RunningsListController);

  RunningsListController.$inject = ['RunningsService'];

  function RunningsListController(RunningsService) {
    var vm = this;
    vm.runnings = RunningsService.query();
  }
}());
