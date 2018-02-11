angular.module('app').controller('HeaderController', function ($rootScope, $location, AuthService) {
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
});