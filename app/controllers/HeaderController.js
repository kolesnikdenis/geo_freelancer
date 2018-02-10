angular.module('app').controller('HeaderController', function ($rootScope) {
    const self = this;
    self.isNavCollapsed = true;
    self.showProfile = false;
    $rootScope.$on('$routeChangeStart', function()  {
        self.isNavCollapsed = true;
    });
    $rootScope.$on('authenticated', function() {
        self.showProfile = true;
    });
    $rootScope.$on('unauthenticated', function() {
        self.showProfile = false;
    })
});