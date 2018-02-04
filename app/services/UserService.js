angular.module('app').factory('UserService', function($http) {
    return {
        login (loginData) {
            return $http.post('http://localhost:8888', loginData) //ссылка на бекэенд
        },
        signup(signUpData) {
            return $http.post('http://localhost:8888', signUpData) //ссылка на бекэенд
        }
    }
});