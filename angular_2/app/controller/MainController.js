app.controller('MainController', ['$scope','books.repository', function($scope, booksRepository) {
    $scope.x = 2;
    $scope.y = 5;

    var z = 3;

    $scope.sum = 0;

    $scope.calc = function() {
        console.log(this);
        $scope.sum = +$scope.x + +$scope.y;
    };
}]);