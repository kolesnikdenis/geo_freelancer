angular.module('app').controller('LoginSignupController', function($rootScope, $location, UserService, notify, AuthService) {
    this.login = function(username, password) {

        if (this.loginForm.$invalid) {
            return;
        }

        const loginData = {
            username: username,
            password: password
        };
        UserService.login(loginData)
            .then((response) => {

                if (response.data.status === 'ok') {
                    AuthService.saveAuthData(response.data.user_profile.token, response.data.user_profile.mail, response.data.user_profile.id);
                    $rootScope.$broadcast('authenticated');
                    notify({
                        message: 'Вход выполнен успешно',
                        duration: 10000,
                        classes: 'alert alert-success'
                    });
                    $location.path("/");
                }
                else {
                    notify({
                        message: 'Неверный юзернейм или пароль',
                        classes: 'alert alert-danger',
                        duration: 0,
                    });
                }
            })
            .catch((error) => {
                notify({
                    message: 'Произошла ошибка, попробуйте позже',
                    classes: 'alert alert-danger',
                    duration: 0,
                });
            })
    };
    this.signup = function(username, password) {

        if (this.signupForm.$invalid) {
            return;
        }

        const signUpData = {
            username: username,
            password: password
        };
        UserService.signup(signUpData)
            .then((response) => {
                if (response.data.status === 'ok') {
                    notify({
                        message: 'Спасибо за регистрацию! На Вашу почту был выслан запрос на подтверждение email адреса.',
                        duration: 10000,
                        classes: 'alert alert-success'
                    });
                    $location.path("/");
                }
                else {
                    notify({
                        message: 'Пользователь с таким именем уже существует',
                        classes: 'alert alert-danger',
                        duration: 0,
                    });
                }
            })
            .catch((error) => {
                notify({
                    message: 'Ошибка регистрации, попробуйте позже',
                    classes: 'alert alert-danger',
                    duration: 0,
                });
            })
    }
});
