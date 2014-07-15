angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'angulartics', 
  'angulartics.google.analytics',
  'ngBoilerplate.home',
  'ngBoilerplate.about',
  'ui.router',
  'hljs'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider, hljsServiceProvider ) {
  $urlRouterProvider.otherwise( '/home' );

})

.run(['$window', '$timeout', '$rootScope', '$q', function run ($window, $timeout, $rootScope, $q) {
    /**
     * Manage history
     */
    $rootScope.logs = [];
    
    /**
     * Cast is ready?!
     */
    if (!$window.chrome.cast || ! $window.chrome.cast.isAvailable) {
        var def = $q.defer();
        $timeout(function(){
            def.resolve(chrome.cast);
            $rootScope.cast = def.promise;
            $rootScope.logs.push({
                type: 'info',
                message: 'Cast SDK is ready'
            });
        }, 1000);
    }
}])

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
});

