angular.module('app').factory('UserService', function($http) {
    return {
        login(loginData) {
            return $http.post('//freelance.kolesnikdenis.com/api/account', loginData)
        },
        signup(signUpData) {
            return $http.post('//freelance.kolesnikdenis.com/api/registration', signUpData)
        },
        confirm(validationData) {
            return $http.post('//freelance.kolesnikdenis.com/api/validation', validationData)
        },
        requestUserInfo(UserInfo) {
            return $http.post('//freelance.kolesnikdenis.com/api/account/info', UserInfo)
        },
        requestUpdateUserInfo(UpdateUserInfo) {
            return $http.post('//freelance.kolesnikdenis.com/api/account/update', UpdateUserInfo)
        }
    }
});
