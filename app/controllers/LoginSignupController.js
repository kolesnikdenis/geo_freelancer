angular.module('app').controller('LoginSignupController', function(UserService) {
    this.login = function(username, password) {
        const loginData = {
            username: username,
            password: password
        };
        UserService.login(loginData)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            })
    };
    this.signup = function(username, password, passwordRepeat, firstName="", lastName="", city="", phone="") {
        const signUpData = {
            username: username,
            password: password,
            passwordRepeat: passwordRepeat,
            firstName: firstName,
            lastName: lastName,
            city: city,
            phone: phone
        };
        UserService.signup(signUpData)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            })
    }
});