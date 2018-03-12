angular.module('app').factory('UserService', function($http) {
    return {
        login(loginData) {
            return $http.post('//uwork.pp.ua/api/account', loginData)
        },
        signup(signUpData) {
            return $http.post('//uwork.pp.ua/api/registration', signUpData)
        },
        confirm(validationData) {
            return $http.post('//uwork.pp.ua/api/validation', validationData)
        },
        requestUserInfo(UserInfo) {
            return $http.post('//uwork.pp.ua/api/account/info', UserInfo)
        },
        requestUpdateUserInfo(UpdateUserInfo) {
            return $http.post('//uwork.pp.ua/api/account/update', UpdateUserInfo)
        },
        requestGetInfoAboutUser(UserId) {
            return $http.get('//uwork.pp.ua/api/get_user_profile/'+UserId)
        },
    }
});
