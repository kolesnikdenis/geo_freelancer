angular.module('app').controller('createBlog',  function($scope, $http) {




  $scope.blog =  [
            {
                title: '',
                content: '',
                categories: '',
                datatime: '',
                photos: [],
                id: '',
                autor: ''
            }
          ];


          $scope.addBlog = function (blog) {
              console.log(blog)
              $http.post('//freelance.kolesnikdenis.com/api/blog_add/', blog)
              .then(function (responce){
                  console.log('Blog successfully saved')
                  $scope.blog_array.push(blog);
                  $scope.blog = null;
                  }
              );

            };



            $http.get('https://freelance.kolesnikdenis.com/api/category/root')
            .then(function (responce){
                  $scope.categories=responce.data.response;
                  console.log($scope.categories)
                }, function error(response){
                        console.log("Возникла ошибка");
                }
            );

  $scope.categories =  [
            {
                name: '',
                id: '',
                autor: ''
            }
          ];



});
