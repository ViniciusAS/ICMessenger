
angular.module('icmessenger.apphome',['icmessenger.services','icmessenger.messages'])
.controller('appHome',function( $scope, $ionicPlatform, $ionicScrollDelegate, UserService, MessageService, $ionicActionSheet, $state, $ionicLoading ){

    (function(){
      var sendButton = angular.element( document.querySelector( '#send' ) );
      var sendIcon = 'ion-paper-airplane';
      if ( $ionicPlatform.is('android') )
        sendIcon = 'ion-android-send';
      else if ( $ionicPlatform.is('ios') )
        sendIcon = 'ion-ios-paperplane';
      sendButton.addClass( sendIcon );
    })();

    $scope.messages = [];
    $scope.insertMessage = function(messageData){
        if ( $scope.messages.length > 49 ){
            $scope.messages.shift();
        }
        $scope.messages.push(messageData);
        $scope.$apply();
        $ionicScrollDelegate.scrollBottom(true);
    };

    var user = UserService.getUser('facebook');

    MessageService.receiveMessages(function(message){
        $scope.insertMessage(message);
    });

    // on page load
    $scope.load = function () {
        MessageService.start( user.name, user.picture, function(){
            MessageService.getMessages(function(messages){
                $scope.messages = messages;
                $scope.$apply();
                angular.element(document).ready(function(){
                    $ionicScrollDelegate.scrollBottom(true);
                });
            });
        });
    };

    $scope.send = function(message){
        $scope.messageText = '';
        MessageService.sendMessage(message,function(sent){
            if ( !sent ) return;
            $scope.insertMessage({
                name    : user.name,
                image   : user.picture,
                message : message
            })
        });
    };

    /** LOGOUT **/

    $scope.user = UserService.getUser();

    $scope.logout = function(){
        var hideSheet = $ionicActionSheet.show({
			destructiveText: 'Logout',
			titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
			cancelText: 'Cancel',
			cancel: function() {},
			buttonClicked: function(index) {
				return true;
			},
			destructiveButtonClicked: function(){
				$ionicLoading.show({
				  template: 'Logging out...'
				});

                // Facebook logout
                facebookConnectPlugin.logout(function(){
                  $ionicLoading.hide();
                  $state.go('app.login');
                },
                function(fail){
                  $ionicLoading.hide();
                });
			}
		});
    };


});
