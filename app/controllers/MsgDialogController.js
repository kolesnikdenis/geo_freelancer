angular.module('app').controller('DialogController', function($routeParams,  $location, UserService, notify, AuthService, MsgService,$uibModal) {
    this.from_id= $routeParams.id;

    this.send_message_body ={ to_user_id:$routeParams.id, from_id:0, msg: ""};
    UserService.requestUserInfo(AuthService.getAuthData())
        .then((response) => {
            if (response.data.status === 'ok') {
                this.lastMsgRead=response.data.user_profile.last_read_msg;
                this.to_id=response.data.user_profile.id;
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
                    response.data.arr_msg[i].photos = JSON.parse(response.data.arr_msg[i].photos)[0].filename;
                }
            }
            //console.log(response.data.arr_msg);
            this.arr_dialog = response.data.arr_msg;
        }else {
            notify({
                message: 'Увы, но произошла ощибка загрузки данных',
                classes: 'alert alert-danger',
                duration: 3000,
            });
        }
        //console.log("dialog response:", response);
    });

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
