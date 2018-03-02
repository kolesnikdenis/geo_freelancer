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



  $scope.categories = ['','Спорт', 'Наука', 'Программирование', 'Другое'];



});
