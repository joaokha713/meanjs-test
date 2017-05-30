(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserController', UserController);

  UserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve', 'Notification', 'PasswordValidator'];

  function UserController($scope, $state, $window, Authentication, user, Notification, PasswordValidator) {
    var vm = this;

    vm.authentication = Authentication;
    vm.isNew = !user._id;
    vm.user = user;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
    vm.role = user.roles ? user.roles[0] : 'user';
    vm.remove = remove;
    vm.createOrUpdate = createOrUpdate;
    vm.isContextUserSelf = isContextUserSelf;
    vm.availableRoles = [
      { title: 'user', value: 'user' },
      { title: 'manager', value: 'manager' },
      { title: 'admin', value: 'admin' }
    ];

    function remove(user) {
      if ($window.confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          vm.users.splice(vm.users.indexOf(user), 1);
          Notification.success('User deleted successfully!');
        } else {
          vm.user.$remove(function () {
            $state.go('admin.users');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!' });
          });
        }
      }
    }

    function createOrUpdate(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = vm.user;
      user.roles = [vm.role];

      if (vm.isNew) {
        user.$save(function (resp) {
          $state.go('admin.user', {
            userId: resp._id
          });
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
        }, function (errorResponse) {
          Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User create error!' });
        });
      } else {
        user.$update(function () {
          $state.go('admin.user', {
            userId: user._id
          });
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
        }, function (errorResponse) {
          Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
        });
      }
    }

    function isContextUserSelf() {
      return vm.user.username === vm.authentication.user.username;
    }
  }
}());
