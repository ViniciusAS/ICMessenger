
angular.module('icmessenger.states', [] )

.config(function ( $stateProvider, $urlRouterProvider ) {

  $stateProvider
    .state('app', {
      abstract: true,
      templateUrl: "index.html"
    })
      .state('nostate', {
        url : "/",
        templateUrl : 'index.html',
        controller : 'redirector'
      })
      .state('app.login', {
          url: "/login",
          parent : 'app',
          templateUrl: "templates/login.html",
          controller: 'loginOptions'
      })
      .state('app.home', {
          url: "/home",
          parent : 'app',
          templateUrl: "templates/appHome.html",
          controller: 'appHome'
      });
    $urlRouterProvider.otherwise( "/" );
});
