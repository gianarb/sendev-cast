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
    $scope.bus = [];
    
    $window.sessionListener = function(e){
        console.log("session listener", e);
        $rootScope.cast.then(function(cast){
            $window.session = e;
            $window.session.addUpdateListener(function(isAlive){
                console.log("session updatete", isAlive);
                $window.session = null;
            });
            angular.forEach($scope.bus, function(obj, key){ 
                $window.session.addMessageListener(obj.name, function(message){
                    console.log("ReceiverMessage", message);
                });
            });
        });
    };

    $window.receiverListener = function(e){
        if( e === 'available' ) {
            console.log("receiver found");
        }
        else {
            console.log("receiver list empty");
        }
    };

    $scope.cast = function(appId){
        $rootScope.cast.then(function(cast){
            $window.sessionRequest = new chrome.cast.SessionRequest(appId);
            var apiConfig = new chrome.cast.ApiConfig(
                $window.sessionRequest,
                $window.sessionListener,
                $window.receiverListener
            );
            cast.initialize(
                apiConfig, 
                function(event){console.log('onSuccess', event);}, 
                function(event){console.log('onError', event);}
            );         
        });
    };

    /**
     * Bus section
     */
    $scope.send = function(namespace, message){
        $window.session.sendMessage(
            namespace, 
            message, 
            function(e){console.log("Message sent: " + e);}, 
            function(e){console.log('Error: '+ e);}
        );
    }; 

    $scope.add = function(opt){
        if(!opt.placeholder){
            opt.placeholder = opt.name;
        }
        $scope.bus.push(opt);
        delete $scope.opt;
    };

    $scope.remove = function(name){
        angular.forEach($scope.bus, function(obj, key){ 
        if(obj.name === name){
            $scope.bus.splice(key, 1);
        }
        }, $scope.bus);
    };
}]);

