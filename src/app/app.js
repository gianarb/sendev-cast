angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.about',
  'ui.router'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run(['$window', '$timeout', '$rootScope', '$q', function run ($window, $timeout, $rootScope, $q) {
    if (!$window.chrome.cast || ! $window.chrome.cast.isAvailable) {
        var def = $q.defer();
        $timeout(function(){
            def.resolve(chrome.cast);
            $rootScope.cast = def.promise;
        }, 1000);
    }
}])

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
});

