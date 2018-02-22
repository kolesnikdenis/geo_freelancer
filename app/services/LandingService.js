angular.module('app').factory('LandingService', function($http) {
    return {
        getAll () {
            return $http.get('//freelance.kolesnikdenis.com/api/category/root')
        }
    }
});