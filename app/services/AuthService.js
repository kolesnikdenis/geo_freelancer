angular.module('app').factory('AuthService', function(localStorageService) {
    return {
        isAuthenticated() {
            return localStorageService.get('username') && localStorageService.get('token');
        },
        saveAuthData(token, username, user_id) {
            localStorageService.set('token', token);
            localStorageService.set('user_id', user_id);
            localStorageService.set('username', username);
        },
        getAuthData() {
            return {
                username: localStorageService.get('username'),
                user_id: localStorageService.get('user_id'),
                token: localStorageService.get('token')
            };
        },
        removeAuthData() {
            localStorageService.remove('username');
            localStorageService.remove('user_id');
            localStorageService.remove('token');
        }
    }
});