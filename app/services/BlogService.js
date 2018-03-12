angular.module('app').factory('BlogService', function($http) {
    return {
        getBlogUser (body) {
            return $http.get('//uwork.pp.ua/api/blog_user/'+body)
        },
        getShowBlogContent (body) {
            return $http.get('//uwork.pp.ua/api/show_blog_id/'+body)
        },
        getCommentBlog (body){
            return $http.get('//uwork.pp.ua/api/blog_comment/'+body);
        },
        addComment (body){
            return $http.post('//uwork.pp.ua/api/blog_comment/',body);
        }
    }
});