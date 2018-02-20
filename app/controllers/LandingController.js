angular.module('app').controller('LandingController', function($scope, LandingService) {
    LandingService.getAll().then((category) => {
        $scope.category = category
    })
});