
angular.module('icmessenger.main', [ 'ionic', 'icmessenger.states', 'icmessenger.login', 'icmessenger.apphome' ] )

.run(function( $rootScope, $ionicPlatform, $ionicPopup ) {

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  $ionicPlatform.registerBackButtonAction(function(e){
    var confirmPopup = $ionicPopup.confirm({
      title : 'Confirm exit',
      template : 'Are you sure you want to close the app?',
      okText: 'Yes',
      okType: 'button-positive',
      cancelText: 'No'
    });
    confirmPopup.then(function(close){
      if ( close )
        ionic.Platform.exitApp();
    });
    e.preventDefault();
    return false;
  },101); // 101: priority of execution // 100: hardware button

})

.controller('redirector', function( UserService, $state ){

    // my implementation for auto-login if the user is already logged
    var defaultState = 'app.login';
    if ( UserService.getUser('facebook').userID ){
        defaultState = 'app.home';
    }
    $state.go( defaultState );

});
