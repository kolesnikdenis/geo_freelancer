angular.module('app').factory('PassRestoreService', function($http) {
    return {
        requestReset (resetData) {
            return $http.post('http://freelance.kolesnikdenis.com/api/user/reset_pwd_email', resetData)
        },
        updatePassword(updatePasswordData) {
            return $http.post('http://freelance.kolesnikdenis.com/api/user/reset_pwd', updatePasswordData)
        }
    }
});