angular.module( 'ngBoilerplate.home', [
  'ui.router',
  'plusOne'
])
.config(function config( $stateProvider ) {
  $stateProvider.state( 'home', {
    url: '/home',
    views: {
      "main": {
        controller: 'HomeCtrl',
        templateUrl: 'home/home.tpl.html'
      }
    },
    data:{ pageTitle: 'Home' }
  });
})
.controller('HomeCtrl', ['$scope', '$rootScope', '$window', function HomeController( $scope, $rootScope, $window ) {
    $rootScope.configuration = {};
    $rootScope.configuration.bus = [];
    $scope.initStatus = false;    
    $window.sessionListener = function(e){
        $rootScope.logs.push({
            type:"info",
            message: "Start "+e.displayName+"app, number "+e.appId+" with sessionId ="+e.sessionId
        });
        $rootScope.cast.then(function(cast){
            $window.session = e;
            $window.session.addUpdateListener(function(isAlive){
                $window.session = null;
            });
            angular.forEach($rootScope.configuration.bus, function(obj, key){ 
                $window.session.addMessageListener(obj.name, function(message){
                    $rootScope.logs.push({
                        type:"info",
                        message: "ReceiverMessage from "+ message
                    });
                    $scope.apply();
                });
            });
        });
    };

    $window.receiverListener = function(e){
        if( e === 'available' ) {
            $rootScope.logs.push({
                message: "Receiver found",
                type: "info"
            });
            $scope.initStatus = true;
        }
        else {
            $rootScope.logs.push({
                message: "receiver list empty",
                type: "warning"
            });
            $scope.initStatus = false;
        }
    };

    $scope.cast = function(){
        $rootScope.cast.then(function(cast){
            cast.requestSession(function(e){
                $window.session = e;
            }, function(){
                $rootScope.logs.push({
                    message:"Close extension",
                    type: "warning"
                });
                $scope.$apply();
            });
        });
    };

    $scope.init = function(appId){
        $rootScope.cast.then(function(cast){
            $window.sessionRequest = new chrome.cast.SessionRequest(appId);
            $rootScope.configuration.appId = appId;
            var apiConfig = new chrome.cast.ApiConfig(
                $window.sessionRequest,
                $window.sessionListener,
                $window.receiverListener
            );
            cast.initialize(
                apiConfig, 
                function(event){ 
                    if(event){
                        $rootScope.logs.push({
                            message: event,
                            type: "info"
                        });
                    }
                }, 
                function(event){
                    if(event){
                        $rootScope.logs.push({
                            message: event,
                            type: "error"
                        });
                    }
                }
            );         
        });
    };

    $scope.overrideConf = function(c){
        $rootScope.configuration = JSON.parse(c);
    };

    /**
     *
     * Bus section
     */
    $scope.send = function(namespace, message){
        $window.session.sendMessage(
            namespace, 
            message, 
            function(e){
                $rootScope.logs.push({
                    type: "info",
                    message: e
                });
                $scope.$apply();
            }, 
            function(e){
                $rootScope.logs.push({
                    type: 'error',
                    message: e
                });
            }
        );
    }; 

    $scope.add = function(opt){
        if(!opt.placeholder){
            opt.placeholder = opt.name;
        }
        $rootScope.configuration.bus.push(opt);
        delete $scope.opt;
    };

    $scope.remove = function(name){
        angular.forEach($rootScope.configuration.bus, function(obj, key){ 
        if(obj.name === name){
            $rootScope.configuration.bus.splice(key, 1);
        }
        }, $rootScope.configuration.bus);
    };
}]);

