(function () {
  'use strict';

  var mari = angular.module('mari');

  mari.controller('BowlingCtrl', ['$scope', BowlingCtrl]);

    function BowlingCtrl ($scope, kittays) {
    $scope.characters = kittays.characters();

    $scope.save = function (character) {
      console.log('character: ' + character);
    };
  }
})();
