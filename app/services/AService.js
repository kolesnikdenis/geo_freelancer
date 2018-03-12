angular.module('app').factory('AService', function($http) {
    return {
        getAll () {
            return $http.get('//uwork.pp.ua/api/a_d_s')
        },
        getGeoAll (body) {
            return $http.post('//uwork.pp.ua/api/a_d_s_geo',body)
        },
        getGeoLast () {
            return $http.get('//uwork.pp.ua/api/a_d_s_last')
        },
        createNewAd (adData) {
            return $http.post('//uwork.pp.ua/api/a_d_s_add', adData)
        },
        getAdsUser (id) {
            return $http.get('//uwork.pp.ua/api/a_d_s_user/'+id)
        },
    }
});