(function () {
  'use strict';

  var mari = angular.module('mari');

  mari.controller('FavoritesCtrl', function ($scope, kittays) {
    $scope.characters = kittays.characters();

    $scope.save = function (character) {
      console.log('character: ' + character);
    };
  });
})();
