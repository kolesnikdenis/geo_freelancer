angular.module('app', ['ngRoute', 'ngTouch', 'ngAnimate', 'ui.bootstrap', 'ngMessages', 'cgNotify', 'LocalStorageModule'])
    .config(function($locationProvider, $routeProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $routeProvider
            .when('/', {
                templateUrl: 'views/landing.html',
                controller: 'LandingController',
                controllerAs: 'landingCtrl',
            })
            .when('/login', {
                templateUrl: 'views/loginSignup.html',
                controller: 'LoginSignupController',
                controllerAs: 'loginSignupCtrl',
            })
            .otherwise({'template': '<h1>Route not found</h1>'})
    });

angular.module('app').factory('authInterceptor', function (localStorageService) {
    return {
        request: function (config) {

            const auth = {
                username: localStorageService.get('username'),
                token: localStorageService.get('token')
            };
            if (config.url.match(/^http:\/\/freelance\.kolesnikdenis\.com\/api/)) {
                config.headers['Auth'] = JSON.stringify(auth);
            }
            return config;
        }
    }
});

angular.module('app').config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
});