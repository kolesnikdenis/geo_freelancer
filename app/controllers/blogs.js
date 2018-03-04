angular.module('app').controller('blogs', function($http, $scope, $routeParams) {



$scope.blogs =  [
          {
              title: '',
              content: '',
              autor: '',
              id: '',
              datatime: '',

          }
        ];


          $http.get('http://freelance.kolesnikdenis.com/api/blog').then(function (responce){
                $scope.blogs=responce.data.blog_array;
                console.log($scope.blogs)
              }, function error(response){
                      console.log("Возникла ошибка");
              }
          );



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
             
          }
        ];


  
        
          
          
          

          $scope.show = 'msg1';
          $scope.fullContact = function () {
              $scope.show = $scope.show == 'msg1' ? 'msg2' : 'msg1';

          };


});
