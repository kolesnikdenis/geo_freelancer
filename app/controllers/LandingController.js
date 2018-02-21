angular.module('app').controller('LandingController', function($scope, LandingService) {
    $scope.tt="test";
    $scope.category={};
    LandingService.getAll().then((category) => {
        $scope.category = category.data.response;
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
    });
});