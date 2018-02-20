angular.module('app').factory('AdsService', function($http) {
    return {
        getAll () {
            return $http.get('https://demo2157898.mockable.io/geo/api/ads')
        }
    }
});
