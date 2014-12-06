var angularTest = angular.module('angularTest', []);

angularTest.controller('AngularTest',function($scope) {
  $scope.message = "If you can read this then angular is working!";
});