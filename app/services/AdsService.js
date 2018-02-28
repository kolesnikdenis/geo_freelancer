angular.module('app').factory('AdsService', function($http) {
    return {
        getAll () {
            return $http.get('//freelance.kolesnikdenis.com/api/ads')
        },
        getGeoAll () {
            return $http.post('//freelance.kolesnikdenis.com/api/ads_geo')
        },
        getGeoLast () {
            return $http.get('//freelance.kolesnikdenis.com/api/ads_last')
        },
    }
});