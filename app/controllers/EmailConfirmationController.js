angular.module('app').controller('EmailConfirmationController', function($routeParams, UserService) {
    const confirmationData = {
        username: $routeParams.username,
        token: $routeParams.token,
    };
    UserService.confirm(confirmationData)
        .then(resp => {

        })
        .catch(err => {

    });
});