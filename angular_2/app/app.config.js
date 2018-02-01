app.config(function($routeProvider, $locationProvider){
    $locationProvider.hashPrefix('');

    $routeProvider
        .when('/',{
        templateUrl: 'app/views/main.html'
    })
    .when('/book', {
            templateUrl: 'app/views/booksList.html',
            controller: 'BooksListController'
        })
        .when('/book/:id', {
           templateUrl: 'app/views/book.html',
           controller: 'BooksController'
        })
    .otherwise('/')
});


