app.controller('BooksListController', ['$scope', 'books.repository', '$uibModal', function($scope, booksRepository, $uibModal) {
   //console.log('a');

    $scope.orderField = 'date';

   /* var bookModel = {
        title: "",
        author: "",
        rate: 0,
        cost: 0,
        date: ''
    };*/
    //$scope.newBook = JSON.parse(JSON.stringify(bookModel));

    $scope.books = [];

    booksRepository.getBooks().then(function(response) {
        $scope.books = response.data;
    }, function(error) {
        console.log('error', error);
    });
 /*   $scope.books = [
        {
            title: "You don't know JS",
            author: "Kyle Sipson",
            rate: 10,
            cost: 100,
            date: '2014-01-01'
        },
        {
            title: "Harry Potter and Philosopher Stone",
            author: "Joanne Rowling",
            rate: 10,
            cost: 200,
            date: '1997-06-17'
        },
        {
            title: "Kolobok",
            author: "people",
            rate: 1,
            cost: 300,
            date: '1970-11-05'
        }
    ];*/

    $scope.orderBy = function(field) {
        $scope.orderField = $scope.orderField === field ? '-' + field : field;
    };

    $scope.deleteBook = function(id) {
        booksRepository.deleteBook( id )
            .then(function(response) {
                console.log('response', response);
                var doomed = $scope.books.filter(function(book) { return book.id === id; })[0];
                $scope.books.splice( $scope.books.indexOf(doomed), 1 );
            }, function(error) {});
    };

    $scope.addBook = function() {
        $scope.books.push($scope.newBook);
        $scope.newBook = JSON.parse(JSON.stringify(bookModel));
        $scope.formAdd.$submitted = false;
    };

    $scope.openModal = function() {

        var modalInstance = $uibModal.open({
            templateUrl: 'app/modals/add-book/template.html',
            controller: 'AddBookController'
        });

        modalInstance.result.then(function(data) {
            console.log('data', data);
            booksRepository.createBook(data).then(function(response) {
                $scope.books.push(response.data);
            }, function(error) {});
        }, function() {});
    };

}]);

