angular.module('app').controller('ShowBlogController', function($routeParams,AuthService,BlogService,UserService,notify) {
    this.showblogcontent= $routeParams.id;
    this.comments_blog=[];


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

    BlogService.getShowBlogContent(this.showblogcontent).then((resp)=>{
        if ( resp.data.status=='ok'){
            this.blog_content =resp.data.blog_array[0];
            //console.log(this.blog_content.autor);
            UserService.requestGetInfoAboutUser(this.blog_content.autor).then((rasp_user)=>{
                //console.log(rasp_user.data.user_find);
                this.info_author=rasp_user.data.user_find;
            });
            if (this.blog_content.photos ) {
                this.photos = JSON.parse(this.blog_content.photos);
                $(document).ready(function(){
                    $(".owl-carousel").owlCarousel({
                        items:2,
                        loop:true,
                        margin:1,
                        nav:true,
                        responsiveClass:true,
                        merge: true,
                        autoplay: true,
                        autoplayTimeout: 3000,
                        responsive:{
                            0:{
                                items:1
                            },
                            600:{
                                items:2
                            }
                        }
                    });
                });
            }
        }
    });
    BlogService.getCommentBlog(this.showblogcontent).then((resp) =>{
        //console.log(resp);
        if ( resp.data.status=='ok'){
            this.comments_blog =resp.data.comment_blog;
//            console.log(this.comments_blog);
            for ( var i=0; i<this.comments_blog.length;i++ ){
                if (this.comments_blog[i].photos ) {
                    this.comments_blog[i].photos = JSON.parse(this.comments_blog[i].photos);
                    if (this.comments_blog[i].photos[0] && this.comments_blog[i].photos[0].filename)
                        this.comments_blog[i].photos = "/upload/"+this.comments_blog[i].photos[0].filename;
                    else
                        this.comments_blog[i].photos  = "http://icons.iconarchive.com/icons/tristan-edwards/sevenesque/1024/Preview-icon.png";
                }
            }
        }
    })

    this.constructor_comment={blog_id:this.showblogcontent, msg:""};
    this.send= function(){
        //console.log("save commnet",this.constructor_comment);
        //this.constructor_comment.msg="";
        if (!this.constructor_comment.msg || this.constructor_comment.msg.length <=0 ) {
            notify({ message: "сообщение не может быть пустым", duration: 3000, classes: 'alert alert-danger'  });
        } else {
            BlogService.addComment(this.constructor_comment).then((req) => {
                if (req.data.status=="ok"){
                    notify({ message: "Спасибо, Ваш комментарий успешно добавлен", duration: 3000, classes: 'alert alert-info'  });
                    //this.arr_dialog.push({datetime: new Date(), from_id: this.send_message_body.from_id, to_id: this.send_message_body.to_user_id, msg: this.send_message_body.msg, photos: this.you_photo });
                    this.comments_blog.push({datetime: new Date(), firstname:this.my_info.firstname, msg:this.constructor_comment.msg,surname:this.my_info.surname,photos:this.my_info.photos,user_id:this.my_info.id});
                    console.log(this.comments_blog);
                    this.constructor_comment.msg="";
                }else {
                    notify({ message: "произошла ошибка", duration: 3000, classes: 'alert alert-danger'  });
                }

                console.log(req);
            });
        }
    }


});
