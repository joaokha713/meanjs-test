(function () {
  'use strict';

  angular
    .module('core.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Management',
      state: 'admin',
      type: 'dropdown',
      roles: ['manager', 'admin']
    });
  }
}());
