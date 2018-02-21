angular.module('app').factory('AdsService', function($http) {
    return {
        getAll () {
            return $http.get('http://freelance.kolesnikdenis.com/api/ads')
        }
    }
});
