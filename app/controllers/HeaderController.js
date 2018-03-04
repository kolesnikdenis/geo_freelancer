angular.module('app').controller('HeaderController', function ($rootScope, $location, AuthService,MsgService) {
    const self = this;
    self.isNavCollapsed = true;
    self.showProfile = AuthService.isAuthenticated();
    $rootScope.$on('$routeChangeStart', function()  {
        self.isNavCollapsed = true;
    });
    $rootScope.$on('authenticated', function() {
        self.showProfile = true;
    });
    $rootScope.$on('unauthenticated', function() {
        self.showProfile = false;
    });
    self.signOut = function() {
        $rootScope.$broadcast('unauthenticated');
        AuthService.removeAuthData();
        $location.path('/login');
    }

    if ( AuthService.isAuthenticated() ) {
        console.log("старт проверки на новые сообщения")
        var timerId = setInterval(() => {
            if (AuthService.isAuthenticated()) {
                MsgService.requestGetMsgNew(AuthService.getAuthData())
                    .then((response) => {
                            if (response.data.status === 'ok') {
                                self.new_message = (response.data.new_msg.length > 0) ? response.data.new_msg.length : 0;
                            }
                        }
                    );
            }
        }, 2000);
    }



    });