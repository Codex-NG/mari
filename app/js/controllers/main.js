(function () {
'use strict';

var mari = angular.module('mari');

  mari.controller('MainCtrl', ['$scope' , MainCtrl]);

  function MainCtrl ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }
})();
