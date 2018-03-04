angular.module('app').controller('singleBlog', function($http, $scope, $routeParams) {


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
                var postId = Number($routeParams.postId);
                  $scope.post = _.find($scope.blogs, { id: postId });
                  console.log($scope.post)
                  console.log($scope.postId)
                }, function error(response){
                      console.log("Возникла ошибка");
              }
          );







  $scope.show = 'msg1';
  $scope.fullContact = function () {
  $scope.show = $scope.show == 'msg1' ? 'msg2' : 'msg1'; };



console.log($routeParams.postId)

});
