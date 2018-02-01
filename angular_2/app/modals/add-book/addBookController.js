app.controller('AddBookController', ['$scope', 'books.repository', '$uibModalInstance', function($scope, booksRepository, $uibModalInstance) {
    var bookModel = {
        title: '',
        author_id: '',
        rate: 0,
        cost: 0,
        intro: ''
    };

    $scope.newBook = JSON.parse(JSON.stringify(bookModel));

    $scope.authors = [];
    booksRepository.getAuthors().then(function(response) {
        $scope.authors = response.data.map(function(author) {
            return {
                id: author.id,
                name: author.firstname + ' ' + author.lastname
            }
        });
    });

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

    $scope.ok = function() {
        $uibModalInstance.close($scope.newBook);
    }
}]);