var app = angular.module('NQ', ['ngRoute']); 

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'pages/home.html',
		controller: 'homeController'
      }).
      when('/result', {
        templateUrl: 'pages/result.html',
        controller: 'resultController'
      }).
      when('/questions/:questionId', {
        templateUrl: 'pages/question.html',
		controller: 'questionController'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);
  
  app.directive('preventClick', [function () {
    return function (scope, element) {
        angular.element(element).bind('click', function (event) {
            event.preventDefault();
        });
    };
}]);
  