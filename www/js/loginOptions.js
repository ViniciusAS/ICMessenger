

angular.module('icmessenger.login', ['icmessenger.services'])
  .controller('loginOptions', function( $location, $scope, $state, $q, UserService, $ionicPopup, $ionicLoading ){

    var FBUserLog = function(message){
        $ionicPopup.alert({
          title : 'Facebook Login',
          template : message
        });
    };

    // success callback
    var fbLoginSuccess = function(response){
        // if authentication did not worked very well
        if ( !response.authResponse ){
            fbLoginError("Cannot find the AuthResponse");
            FBUserLog("Error on facebook login");
            return;
        }
        // save authResponse for code optimization
        var authResponse = response.authResponse;

        // get the profile info in callback // function created 2 functions below
        getFacebookProfileInfo(authResponse)
        .then(function(profileInfo){
            // save it somewhere
            // now, on local storage
            UserService.setUser({
                authResponse : authResponse,
                userID : profileInfo.id,
                name : profileInfo.name,
                email : profileInfo.email,
                picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
            });
            // stop loading dumb, everything is ready and set to go
            $ionicLoading.hide();
            // so, go to the home page
            $state.go('app.home');
        }, function(fail){
            FBUserLog("Oops. Fail on get profile info");
            // what happened wrong?
            console.log('profile info fail',fail);
            // anyway, stop loading, nobody likes it
            $ionicLoading.hide();
        });
    };

    // callback from the login method
    var fbLoginError = function(error){
        FBUserLog("Facebook login error");
        console.log('Facebook login error',error);
        $ionicLoading.hide();
    }

    // retrieve facebook profile data
    var getFacebookProfileInfo = function(authResponse){
        // q????
        var info = $q.defer();

        facebookConnectPlugin.api(
            '/me?fields=email,name&access_token='
                +authResponse.accessToken,
            null,
            // success // better treatment after //
            function(response){
                console.log(response);
                info.resolve(response);
            },
            // error // better treatment after //
            function(response){
                console.log(response);
                info.reject(response);
            }
        );
        // return retrieved data
        return info.promise;
    };

    // and finally but not less:
    // FACEBOOK LOGIN BUTTON CLICK EVENT //
    $scope.facebookLogin = function(){
        facebookConnectPlugin.getLoginStatus(function(success){
            if ( success.status === 'connected' ){
                // The user is logged in and has authenticated your app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed request, and the time the access token
                // and signed request each expire
                console.log('getLoginStatus',success.status);

                // check if we have our user saved
                var user = UserService.getUser('facebook');
                if ( !user.userID ){
                    getFacebookProfileInfo(success.authResponse)
                    .then(function(profileInfo){
                        // for the purpose of this example, store data in local storage // again
                        UserService.setUser({
                            authResponse: success.authResponse,
                            userID : profileInfo.id,
                            name : profileInfo.name,
                            email : profileInfo.email,
                            picture : "http://graph.facebook.com/" + success.authResponse.userID +  "/picture?type=large"
                        });
                        $state.go('app.home');
                    }, function(fail){
                        // Fail get profile info
                        console.log('profile info fail', fail);
                    });
                } else {
                    $state.go('app.home');
                }
            } else {
                // If (success.status === 'not_authorized') the user is logged in to Facebook,
	              // but has not authenticated your app
                // Else the person is not logged into Facebook,
	              // so we're not sure if they are logged into this app or not.

				console.log('getLoginStatus', success.status);

				$ionicLoading.show({
                    template: 'Logging in...'
                });

				// Ask the permissions you need. You can learn more about
				// FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
                facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
            }
        });
    };
});
