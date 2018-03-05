angular.module('app').controller('singleBlog', function($http, $scope, $routeParams, BlogService, UserService, notify) {

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


          $http.get('//freelance.kolesnikdenis.com/api/blog_comment/'+$routeParams.postId)
          .then(function (responce){
            console.log(responce)
                $scope.comments=responce.data.comment_blog;

              }, function error(response){
                      console.log("Возникла ошибка");
              }
          );


          UserService.requestUserInfo().then((my_info)=>{
                if (my_info.data.status=="ok"){
                    if (my_info.data.user_profile.photos ) {
                        my_info.data.user_profile.photos = JSON.parse(my_info.data.user_profile.photos);
                        if (my_info.data.user_profile.photos[0] && my_info.data.user_profile.photos[0].filename)
                            my_info.data.user_profile.photos = "/upload/"+my_info.data.user_profile.photos[0].filename;
                        else
                            my_info.data.user_profile.photos  = "http://icons.iconarchive.com/icons/tristan-edwards/sevenesque/1024/Preview-icon.png";

                    }
                    this.my_info=my_info.data.user_profile;
                }else {
                    console.log("вы не зареганы")
                }
            },(err)=>{
                //console.log();
                notify({ message: "Вы не авторизованы, и по этой причине вы не можете писать комментарии", duration: 3000, classes: 'alert alert-danger'  });
            });


    $scope.showblogcontent= $routeParams.postId;
    $scope.comments=[];

        $scope.constructor_comment={blog_id:$scope.showblogcontent, msg:""};
        $scope.send= function(){
          
            if (!$scope.constructor_comment.msg || $scope.constructor_comment.msg.length <=0 ) {
                notify({ message: "сообщение не может быть пустым", duration: 3000, classes: 'alert alert-danger'  });
            } else {
                BlogService.addComment($scope.constructor_comment).then((req) => {
                    if (req.data.status=="ok"){
                        notify({ message: "Спасибо, Ваш комментарий успешно добавлен", duration: 3000, classes: 'alert alert-info'  });
                        
                        $scope.comments.push({datetime: new Date(), firstname:this.my_info.firstname, msg:$scope.constructor_comment.msg,surname:this.my_info.surname,user_id:this.my_info.id});
                        console.log($scope.comments);
                        $scope.constructor_comment.msg="";
                    }else {
                        notify({ message: "произошла ошибка", duration: 3000, classes: 'alert alert-danger'  });
                    }

                    console.log(req);
                });
            }
        }

  $scope.show = 'msg1';
  $scope.fullContact = function () {
  $scope.show = $scope.show == 'msg1' ? 'msg2' : 'msg1'; };

console.log($routeParams.postId)


});
