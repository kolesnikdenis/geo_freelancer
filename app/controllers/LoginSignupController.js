angular.module('app').controller('LoginSignupController', function($location, UserService, notify, localStorageService) {
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
                localStorageService.set('token', response.data.user_profile.token);
                localStorageService.set('username', response.data.user_profile.mail);
                notify({
                    message: 'Вход выполнен успешно',
                    duration: 10000,
                    classes: 'alert alert-success'
                });
                $location.path("/");
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
                notify({
                    message: 'Спасибо за регистрацию! На Вашу почту был выслан запрос на подтверждение email адреса.',
                    duration: 10000,
                    classes: 'alert alert-success'
                });
                $location.path("/");
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
