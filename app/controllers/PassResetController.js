angular.module('app').controller('PassResetController', function($routeParams, $location, PassRestoreService, notify) {

    this.updatePassword = function(password) {

        if (this.resetPassForm.$invalid) {
            return;
        }

        const updatePasswordData = {
            new_pass: password,
            email: $routeParams.email,
            token: $routeParams.token
        };

        PassRestoreService.updatePassword(updatePasswordData)
            .then(() => {
                notify({
                    message: 'Пароль изменен успешно',
                    duration: 10000,
                    classes: 'alert alert-success'
                });
                $location.path("/login");
            })
            .catch(() => {
                notify({
                    message: 'Произошла ошибка, попробуйте позже',
                    classes: 'alert alert-danger',
                    duration: 0,
                });
            })
    };
});