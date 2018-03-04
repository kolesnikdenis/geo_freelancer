angular.module('app').controller('MessageController', function ($rootScope, $location, AuthService, MsgService, UserService) {
    $rootScope.showmessage = function (in_id) {
        $location.path("/messages/" + in_id);
    };

    UserService.requestUserInfo(AuthService.getAuthData())
        .then((response) => {
            if (response.data.status === 'ok') {
                $rootScope.lastMsgRead=response.data.user_profile.last_read_msg
            }
            else {
                $rootScope.$broadcast('unauthenticated');
                AuthService.removeAuthData();
                $location.path('/login');
            }
        });
    MsgService.requestUniqueAuthor().then((response) => {
        console.log(response);
        if (response.data.status === 'ok') {
            //console.log(response.data.arr_msg);
            $rootScope.message = response.data.arr_msg;
        }}
    );

})
