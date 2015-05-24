/**
 * Created by illumimari on 5/14/15.
 */

(function () {
  "use strict";
  var mari = angular.module("mari");
  mari.service("mari.openLink", ['$location', openLinkService]);

  function openLinkService ($location){
    function openLink(link) {
      var linkPath;
      switch (link) {
        case 'about':
          linkPath = "/about";
          break;
        case 'work':
          linkPath = "/work";
          break;
        case 'bowling':
          linkPath = "/bowling";
          break;
        default:
          linkPath = link;
          break;
      }
      $location.path(linkPath);
    }
    return openLink;
  }

})();
