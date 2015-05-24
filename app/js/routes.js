// Routes

(function() {

"use strict";
var mari = angular.module("mari");
mari.config(["$routeProvider", "$locationProvider", routes]);

function routes ($routeProvider, $locationProvider) {

  // Using Html 5 History API instead of the HashBang mode
  $locationProvider.html5Mode(true);

  // Welcome route
  $routeProvider.when("/", {
    controller: "MainCtrl",
    templateUrl: "views/welcome.html"
  });

  // About route
  $routeProvider.when("/about", {
    controller: "MainCtrl",
    templateUrl: "views/main.html"

  });

  // Workspace route
  $routeProvider.when("/work", {
    controller: "WorkCtrl",
    templateUrl: "views/work.html"
  });

  // Error route
  $routeProvider.when("/error", {
    controller: "ErrorCtrl",
    templateUrl: "partials/error.html"
  });

  // Default route
  $routeProvider.otherwise({
    redirectTo: "/"
  });

}

})();
