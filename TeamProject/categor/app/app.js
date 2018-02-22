var app = angular.module('categories', [
    'ui.bootstrap',
    'ngRoute'
]);



app.controller ('CarouselCtrl', function($scope){
    $scope.myInterval = 3000;
    $scope.slides = [
        {
            image: 'https://images.unsplash.com/photo-1461938337379-4b537cd2db74?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f3046c519396259989fa04f66f0fe20e&auto=format&fit=crop&w=701&q=80'
        },
        {
            image: 'https://images.unsplash.com/photo-1493135637657-c2411b3497ad?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=874bd9554eb71a95b5f24b03b2506892&auto=format&fit=crop&w=751&q=80'
        },
        {
            image: 'http://cleanmyspace.com/wp-content/uploads/2017/08/how-to-hire-a-cleaning-service.jpg'
        }
    ];
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
