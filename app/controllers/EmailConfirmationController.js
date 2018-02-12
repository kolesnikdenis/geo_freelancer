angular.module('app').controller('EmailConfirmationController', function($rootScope, $routeParams, UserService, AuthService) {
    const self = this;
    self.showSuccess = false;
    self.showError = false;
    const confirmationData = {
        username: $routeParams.username,
        token: $routeParams.token,
    };
    UserService.confirm(confirmationData)
        .then(response => {
            if (response.data.status ==='ok') {
                AuthService.saveAuthData(confirmationData.token, confirmationData.username);
                $rootScope.$broadcast('authenticated');
                self.showSuccess = true;
                self.showError = false;
            }
            else {
                self.showSuccess = false;
                self.showError = true;
            }
        })
        .catch(error => {
            self.showSuccess = false;
            self.showError = true;
    });
});