angular.module('app').factory('LandingService', function($http) {
    return {
        getAll () {
            return $http.get('http://freelance.kolesnikdenis.com/api/category/root')
        }
    }
});