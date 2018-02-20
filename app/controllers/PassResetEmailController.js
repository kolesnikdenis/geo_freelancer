angular.module('app').controller('PassResetEmailController', function(PassRestoreService, notify) {

    this.requestReset = function(username) {

        if (this.resetPassEmailForm.$invalid) {
            return;
        }

        PassRestoreService.requestReset({email: username})
            .then(() => {
                notify({
                    message: 'Инструкции для смены пароля были пересланы на указанный email',
                    duration: 10000,
                    classes: 'alert alert-success'
                });
            })
            .catch((error) => {
                notify({
                    message: (error.data.replace('\n', '') === 'user not found')
                        ? 'Такого пользователя не существует, пожалуйста проверьте правильность email'
                        : 'Произошла ошибка, попробуйте позже',
                    classes: 'alert alert-danger',
                    duration: 0,
                });
            })
    };
});