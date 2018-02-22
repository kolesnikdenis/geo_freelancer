angular.module('app').factory('AdsService', function($http) {
    return {
        getAll () {
            return $http.get('//freelance.kolesnikdenis.com/api/ads')
        }
    }
});
