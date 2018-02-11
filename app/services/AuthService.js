angular.module('app').factory('AuthService', function(localStorageService) {
    return {
        isAuthenticated() {
            return localStorageService.get('username') && localStorageService.get('token');
        },
        saveAuthData(token, username) {
            localStorageService.set('token', token);
            localStorageService.set('username', username);
        },
        getAuthData() {
            return {
                username: localStorageService.get('username'),
                token: localStorageService.get('token')
            };
        },
        removeAuthData() {
            localStorageService.remove('username');
            localStorageService.remove('token');
        }
    }
});