app.factory('books.repository', ['$http', 'WebApi', function($http, webApi) {
    return {
        getBooks: _getBooks,
        deleteBook: _deleteBook,
        getAuthors: _getAuthors,
        createBook: _createBook,
        getBookById: _getBookById
    };

    function _getBooks() {
        return $http.get(webApi.URL + '/api/v1/books');
    }

    function _createBook(data) {
        return $http.post(webApi.URL + '/api/v1/books', data);
    }

    function _deleteBook(id) {
        return $http.delete(webApi.URL + '/api/v1/books/' + id);
    }

    function _getAuthors() {
        return $http.get(webApi.URL + '/api/v1/authors');
    }

    function _getBookById(id){
        return $http.get(webApi.URL + '/api/v1/books/' + id);
    }
}]);