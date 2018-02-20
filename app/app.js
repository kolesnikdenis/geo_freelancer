angular.module('app', ['ngRoute', 'ngTouch', 'ngAnimate', 'ui.bootstrap'])
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

$(document).ready(function(){
    $(".owl-carousel").owlCarousel({
        items:4,
        loop:true,
        margin:10,
        nav:false,
        responsiveClass:true,
        merge: true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:2
            },
            1000:{
                items:3
            }
        }
    });
});