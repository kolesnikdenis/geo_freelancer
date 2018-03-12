angular.module('app').controller('DetailsAnyUserController', function($routeParams,UserService,  $compile,$uibModal,AuthService,MsgService,notify,$location) {
    this.user_id= $routeParams.id;

    UserService.requestGetInfoAboutUser(this.user_id).then((resp_user) => {
        this.infoUser= resp_user.data.user_find;

        if (resp_user.data.user_find && resp_user.data.user_find.photos){
            this.photo = JSON.parse(resp_user.data.user_find.photos)
            if (this.photo.length>0)
                this.photo = this.photo[0].filename;
            else
                this.photo = "logo-anonymous.png";
        }
    });

    this.showBlog = function (id) {
        $location.path('/bloglistuser/'+id);
    };
    this.showActivitySheet = function (id) {
        $location.path('/activityuser/'+id);
    };
    this.sendmessage = function () {
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/modals/message/send_message.html',
            controller: function ($uibModalInstance, $scope, items) {
                $scope.send_message_body = {
                    to_user_id: $routeParams.id,
                    from_id: !AuthService.getAuthData().user_id ? 0 : AuthService.getAuthData().user_id,
                    msg: ""
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.send = function () {
                    if (!this.send_message_body.msg || this.send_message_body.msg.length <= 0) {
                        notify({
                            message: "сообщение не может быть пустым",
                            duration: 3000,
                            classes: 'alert alert-danger'
                        });
                    } else {
                        MsgService.requestSendMsg($scope.send_message_body).then((resp_user) => {
                            if (resp_user.data.status == "ok") {
                                notify({
                                    message: "Спасибо, Ваше сообщение успешно отправлено",
                                    duration: 3000,
                                    classes: 'alert alert-info'
                                });
                            } else {
                                console.log(resp_user);
                                notify({message: "произошла ошибка", duration: 3000, classes: 'alert alert-danger'});
                            }

                        });
                        $uibModalInstance.close(this.send_message_body);
                    }
                };

                $uibModalInstance.result.then(function (selectedItem) {

                    console.log("тут шлем:", selectedItem);
                }, function () {
                    console.log("почему??? :'(");
                });

            },
            resolve: {
                items: function () {
                    console.log("test");
                    return this;
                }
            }
        });
    }

});