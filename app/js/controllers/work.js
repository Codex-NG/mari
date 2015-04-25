(function(){
'use strict';

var mari = angular.module('mari');
  mari.controller('AboutCtrl', ['$scope', AboutCtrl]);

  function AboutCtrl ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }
})();
