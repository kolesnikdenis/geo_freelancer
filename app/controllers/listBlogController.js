angular.module('app').controller('listBlogController', function($routeParams,UserService,  $compile,AuthService,BlogService,$location) {
    this.user_id= $routeParams.id;

    BlogService.getBlogUser($routeParams.id).then((response) => {
        console.log(response);
        this.blog_list = response.data.blog_array;
        if (this.blog_list.length>0)
            for(var i=0; i<this.blog_list.length; i++){
                this.blog_list[i].photos = JSON.parse(this.blog_list[i].photos);
            }
    },(err)=>{console.log(err)});
    this.showcontent=function(id){
        console.log(id);
        $location.path('/showblog/'+id);
    }
})