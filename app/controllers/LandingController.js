angular.module('app').controller('LandingController', function($location, $scope, LandingService) {
    $scope.category={};
    LandingService.getAll().then((category) => {
        $scope.category = category.data.response;
        $(document).ready(function(){
            $(".owl-carousel").owlCarousel({
                items:4,
                loop:true,
                margin:1,
                nav:false,
                responsiveClass:true,
                merge: true,
                autoplay: true,
                autoplayTimeout: 3000,
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
    $scope.querySearch = function(queryString) {
        $location.path("/extendedSearch/" + queryString);
    }
});