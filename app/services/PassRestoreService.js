angular.module('app').factory('PassRestoreService', function($http) {
    return {
        requestReset (resetData) {
            return $http.post('//uwork.pp.ua/api/user/reset_pwd_email', resetData)
        },
        updatePassword(updatePasswordData) {
            return $http.post('//uwork.pp.ua/api/user/reset_pwd', updatePasswordData)
        }
    }
});