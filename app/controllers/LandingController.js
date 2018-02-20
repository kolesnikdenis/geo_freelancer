angular.module('app').controller('LandingController', function($scope, LandingService) {
    $scope.tt="test";
    $scope.category={};
    LandingService.getAll().then((category) => {
        $scope.category = category.data.response;
        console.log($scope.category)
        category.data.response.map( function (item){ console.log(item.icon)})
    })
});