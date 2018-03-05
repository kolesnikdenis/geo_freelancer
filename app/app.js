angular.module('app', ['ngRoute', 'ngTouch', 'ngAnimate', 'ui.bootstrap', 'ngMessages', 'cgNotify', 'LocalStorageModule', 'rzModule','ngFileUpload', 'uiGmapgoogle-maps'])
    .config(function($locationProvider, $routeProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $routeProvider
            .when('/', {
                templateUrl: '/views/landing.html',
                controller: 'LandingController',
                controllerAs: 'landingCtrl',
            })
            .when('/login', {
                templateUrl: '/views/loginSignup.html',
                controller: 'LoginSignupController',
                controllerAs: 'loginSignupCtrl',
            })
            .when('/validation/:token/:username', {
                templateUrl: '/views/emailConfirmation.html',
                controller: 'EmailConfirmationController',
                controllerAs: 'emailConfirmationCtrl',
            })
            .when('/passResetEmail', {
                templateUrl: '/views/passResetEmail.html',
                controller: 'PassResetEmailController',
                controllerAs: 'passResetEmailCtrl',
            })
            .when('/forget_password/:email/:token', {
                templateUrl: '/views/passReset.html',
                controller: 'PassResetController',
                controllerAs: 'passResetCtrl',
            })
            .when('/extendedSearch/:categoryId/:queryString?', {
                templateUrl: '/views/extendedSearch.html',
                controller: 'ExtendedSearchController',
                controllerAs: 'extendedSearchCtrl',
            })
            .when('/profile', {
                templateUrl: 'views/userInfo.html',
                controller: 'ProfileController',
                controllerAs: 'profileControllerCtrl',
            })
            .when('/postAd', {
                templateUrl: '/views/postAd.html',
                controller: 'PostAdController',
                controllerAs: 'postAdCtrl',
            })
            .when('/messages/:id', {
                templateUrl: '/views/showMsgDialog.html',
                controller: 'DialogController',
                controllerAs:"DialogControllerCtrl"
            })
            .when('/message', {
                templateUrl: 'views/showMsg.html',
                controller: 'MessageController',
                controllerAs: 'MessageControllerCtrl',
            })
            .when('/blogs', {
                templateUrl: '/views/blogs.html',
                controller: 'blogs',
            })
            .when('/createblog', {
                templateUrl: '/views/createblog.html',
                controller: 'createBlog',
            })
            .when('/kontakt', {
                templateUrl: '/views/kontakt.html',
                controller: 'kontakt',
            })
            .when('/onas', {
                templateUrl: '/views/onas.html',
                controller: 'oNas',
            })
            .when('/blogs/:postId', {
                templateUrl: '/views/singleblog.html',
                controller: 'singleBlog',
            })
            .when('/infouser/:id', {
                templateUrl: '/views/detailsanyuser.html',
                controller: 'DetailsAnyUserController',
                controllerAs:"DetailsAnyUserControllerCtrl"
            })
            .when('/bloglistuser/:id', {
                templateUrl: '/views/listBlogUser.html',
                controller: 'listBlogController',
                controllerAs:"listBlogControllerCtrl"
            })
            .when('/showblog/:id', {
                templateUrl: '/views/ShowBlogContent.html',
                controller: 'ShowBlogController',
                controllerAs:"ShowBlogControllerCtrl"
            })
            .when('/activityuser/:id', {
                templateUrl: '/views/ActivitySheet.html',
                controller: 'ActivitySheetController',
                controllerAs:"ActivitySheetControllerCtrl"
            })
            .otherwise({'template': '<h1>Route not found</h1>'})
    });



angular.module('app').factory('authInterceptor', function (AuthService) {
    return {
        request: function (config) {
            const auth = AuthService.getAuthData();
            if (config.url.match(/\/\/freelance\.kolesnikdenis\.com\/api/)) {
                config.headers['Auth'] = JSON.stringify(auth);
            }
            if (config.url.match(/\/\/uwork\.pp\.ua\/api/)) {
                config.headers['Auth'] = JSON.stringify(auth);
            }
            return config;
        }
    }
});

angular.module('app').factory('authErrorInterceptor', function ($rootScope, $location, AuthService) {
    return {
        responseError: function (rejection) {
            if(rejection.status === 401) {
                $rootScope.$broadcast('unauthenticated');
                AuthService.removeAuthData();
                $location.path('/login')
            }
            return rejection;
        }
    }
});

angular.module('app').config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
});
