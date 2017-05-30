(function () {
  'use strict';

  // Authentication service for user variables

  angular
    .module('users.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$window'];

  function Authentication($window) {
    var auth = {
      user: $window.user
    };

    if (auth.user && auth.user.roles) {
      Object.assign(auth.user, {
        isAdmin: auth.user.roles.indexOf('admin') > -1
      });
    }

    return auth;
  }
}());
