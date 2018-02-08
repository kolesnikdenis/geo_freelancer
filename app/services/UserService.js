angular.module('app').factory('UserService', function($http) {
    return {
        login (loginData) {
            return $http.post('http://freelance.kolesnikdenis.com/api/account', loginData)
        },
        signup(signUpData) {
            return $http.post('http://freelance.kolesnikdenis.com/api/registration', signUpData)
        }
    }
});
