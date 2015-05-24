(function () {
'use strict';

var mari = angular.module('mari');

  mari.controller('MainCtrl', ['$scope', 'mari.openLink' , MainCtrl]);

  function MainCtrl ($scope, openLink) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.openLink = openLink;
  }
})();
