angular.module('app').controller('DialogController', function($routeParams,  $location, UserService, notify, AuthService, MsgService,$uibModal) {
    this.from_id= $routeParams.id;

    this.send_message_body ={ to_user_id:$routeParams.id, from_id:0, msg: ""};
    UserService.requestUserInfo(AuthService.getAuthData())
        .then((response) => {
            if (response.data.status === 'ok') {
                this.lastMsgRead=response.data.user_profile.last_read_msg;
                this.to_id=response.data.user_profile.id;
                //console.log("this.lastMsgRead:",this.lastMsgRead);
                this.send_message_body.from_id=response.data.user_profile.id;
                if ( JSON.parse(response.data.user_profile.photos) && JSON.parse(response.data.user_profile.photos)[0] && JSON.parse(response.data.user_profile.photos)[0].filename )
                    this.you_photo =JSON.parse(response.data.user_profile.photos)[0].filename;
                else
                    this.you_photo = "http://icons.iconarchive.com/icons/tristan-edwards/sevenesque/1024/Preview-icon.png";
            }
            else {
                this.$broadcast('unauthenticated');
                AuthService.removeAuthData();
                $location.path('/login');
            }
        });

    MsgService.requestMsgDialog($routeParams.id).then((response) => {
        if ( response.data.status == 'ok') {
            if (response.data.arr_msg.length > 0){
                for (var i=0; i<response.data.arr_msg.length; i++){
                    if (JSON.parse(response.data.arr_msg[i].photos)[0] && JSON.parse(response.data.arr_msg[i].photos)[0].filename)
                        response.data.arr_msg[i].photos = JSON.parse(response.data.arr_msg[i].photos)[0].filename;
                    else
                        response.data.arr_msg[i].photos="logo-anonymous.png";
                }
            }
            //console.log("last id:", response.data.arr_msg[(response.data.arr_msg.length-1)].id, "user last read:", this.lastMsgRead);
            this.last_id_dialog = response.data.arr_msg[(response.data.arr_msg.length-1)].id;
            this.arr_dialog = response.data.arr_msg;
        }else {
            notify({
                message: 'Увы, но произошла ощибка загрузки данных',
                classes: 'alert alert-danger',
                duration: 3000,
            });
        }
    });

    setTimeout(()=>{
        //console.log(this.lastMsgRead );
        if (this.lastMsgRead && this.last_id_dialog ){
            if (this.lastMsgRead  < this.last_id_dialog  ){
                //console.log("обновляем последний прочитанный посто");
                MsgService.requestMsgLastRead(this.last_id_dialog).then((response) =>{
                    if (response.data.status=="ok") {
                        console.log("обновили");
                    } else {
                        notify({
                            message: 'Увы, но произошла ощибка обновления последнего прочитанного поста',
                            classes: 'alert alert-danger',
                            duration: 3000,
                        });
                    }
                })
            }
        }
    },2000)

    this.send = function() {
        if (!this.send_message_body.msg || this.send_message_body.msg.length <=0 ) {
            notify({ message: "сообщение не может быть пустым", duration: 3000, classes: 'alert alert-danger'  });
        } else {
            MsgService.requestSendMsg(this.send_message_body).then((resp_user) => {
                if (resp_user.data.status=="ok"){
                    notify({ message: "Спасибо, Ваше сообщение успешно отправлено", duration: 3000, classes: 'alert alert-info'  });
                    this.arr_dialog.push({datetime: new Date(), from_id: this.send_message_body.from_id, to_id: this.send_message_body.to_user_id, msg: this.send_message_body.msg, photos: this.you_photo });
                    this.send_message_body.msg="";
                }else {
                    notify({ message: "произошла ошибка", duration: 3000, classes: 'alert alert-danger'  });
                }
            });
        }
    };
});
