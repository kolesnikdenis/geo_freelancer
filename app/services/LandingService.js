angular.module('app').factory('LandingService', function($http) {
    return {
        getAll () {
            return $http.get('//uwork.pp.ua/api/category/root')
        }
    }
});