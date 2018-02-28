angular.module('app').controller('LandingController', function($location, $scope, LandingService,AdsService,UserService,  $compile,$uibModal,AuthService,MsgService,notify) {
    $scope.category={};
    LandingService.getAll().then((category) => {
        $scope.category = category.data.response;
        $(document).ready(function(){
            $(".owl-carousel").owlCarousel({
                items:4,
                loop:true,
                margin:1,
                nav:false,
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
                    },
                    1000:{
                        items:3
                    }
                }
            });
        });
    });
    $scope.querySearch = function(queryString) {
        $location.path("/extendedSearch/" + (queryString || ''));
    };

    //инициилизация карт 2 шт.)
    var infoWindow = new google.maps.InfoWindow();
    $scope.markers = [];
    $scope.map = new google.maps.Map(document.getElementById('BigMap'), {
        zoom: 10,
        center: new google.maps.LatLng(50.047634, 36.421734),
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        disableDefaultUI: true
    });

    $scope.map1 = new google.maps.Map(document.getElementById('LittleMap'), {
        zoom: 10,
        center: new google.maps.LatLng(50.047634, 36.421734),
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        disableDefaultUI: true
    });

    $scope.send_msg_to = function(to_user_id){
        //console.log("test send to",to_user_id)
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/modals/message/send_message.html',
            //template: '<input type=text class="input"><br><button >отправить сообщение пользователю</button>',
            controller:function($uibModalInstance ,$scope,items){
                $scope.send_message_body ={to_user_id: to_user_id, from_id:!AuthService.getAuthData().user_id?0:AuthService.getAuthData().user_id, msg: ""};

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                    console.log('well  bye Bye');
                };
                $scope.send = function() {
                    if (!$scope.send_message_body.msg || $scope.send_message_body.msg.length <=0 ) {
                        notify({ message: "сообщение не может быть пустым", duration: 3000, classes: 'alert alert-danger'  });
                    } else {
                        console.log($scope.send_message_body);
                        MsgService.requestSendMsg($scope.send_message_body).then((resp_user) => {
                            if (resp_user.data.status=="ok"){
                                notify({ message: "Спасибо, Ваше сообщение успешно отправлено", duration: 3000, classes: 'alert alert-info'  });
                            }else {
                                notify({ message: "произошла ошибка", duration: 3000, classes: 'alert alert-danger'  });
                            }

                        });
                        $uibModalInstance.close($scope.send_message_body);
                    }
                };

                $uibModalInstance.result.then(function (selectedItem) {
                    console.log("тут шлем:",selectedItem);
                    /*loginData={username: selectedItem.mail, password:selectedItem.password};
                    $http.post('//freelance.kolesnikdenis.com/api/account', loginData).then(
                        function (response) {
                            if (response.data.status == "ok" ) {
                                console.log("тут шлем:D")
                            }else {
                                console.log("error:",response);
                            }
                        })*/
                    //modalInstance.close(console.log($scope.newUser));
                }, function () {
                    //console.log('Modal dismissed at: ' + new Date());
                    console.log("почему??? :'(");
                    //modalInstance.dismiss(console.log($scope.newUser));
                });

            },
            //size: size,
            //appendTo: parentElem,
            resolve: {
                items: function () {
                    return $scope;
                }
            }
        });

    };

    //если геолокация абона доступна то:
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(location) {
            var my_coord= {lat: location.coords.latitude, lng: location.coords.longitude};
            $scope.map.setCenter(my_coord);
            $scope.map.setZoom(15);
            AdsService.getGeoAll(my_coord).then((resp) => {
                var arr_data=resp.data.ads_rows;
                var createMarker = function (info,who_marker){
                    var color="";
                    if ( info.color ) { color = info.color} else { color = "#FF0000";}
                    if ( !who_marker ) {
                        var marker = new google.maps.Marker({
                            map: $scope.map,
                            position: new google.maps.LatLng(info.lat, info.lng),
                            title: info.title,
                            icon: info.icon,
                            labelContent: '<i  style="color:rgba(153,102,102,0.8);"></i>',
                            labelAnchor: new google.maps.Point(22, 50)

                        });
                    } else {
                        var marker = new google.maps.Marker({
                            map: $scope.map,
                            position: new google.maps.LatLng(info.lat, info.lng),
                            title: info.title,
                            animation: google.maps.Animation.DROP,
                        });
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                    }

                    UserService.requestGetInfoAboutUser(arr_data[i].user_id).then((resp_user) => {
                        $scope.name = resp_user.data.user_find.surname + " " + resp_user.data.user_find.firstname;
                        $scope.mail = resp_user.data.user_find.mail;
                        $scope.photo ="";
                        $scope.rating= resp_user.data.user_find.rating;
                        $scope.id=resp_user.data.user_find.id;
                        //$scope.send_message_body.from_id = resp_user.from_user_id;  // если токен абонента пуст
                        if ( JSON.parse(resp_user.data.user_find.photos) && JSON.parse(resp_user.data.user_find.photos)[0] && JSON.parse(resp_user.data.user_find.photos)[0].filename ) {
                            $scope.photo = JSON.parse(resp_user.data.user_find.photos)[0].filename ;
                        }
                        var html = "<ng-include src=\"'" + "/modals/marker/lending_marker_info.html" + "'\"></ng-include>";
                        var div = $('<div>');
                        div.html(html);
                        var newElem = $compile(div)($scope);
                       // var compiled = $compile(marker.content)($scope);
                        google.maps.event.addListener(marker, 'click', function () {
                            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                            infoWindow.setContent( newElem[0]),
                            infoWindow.open($scope.map, marker);
                        });
                        $scope.markers.push(marker);
                    })


                };
                function getValue(array, value) {
                    var obj = array.filter(function(arr, i){
                        if (arr.id == value ) { return i }
                    });
                    return obj;
                }

                for ( var i=0; arr_data.length > i; i++){
                    var geo={};
                    try { geo = JSON.parse(arr_data[i].geo); }
                    catch (err) { geo={} }

                    ads_coord = JSON.parse(arr_data[i].geo);
                    if  ( Math.pow((my_coord.lat-ads_coord.lat),2) + Math.pow((my_coord.lng-ads_coord.lng),2) <= (Math.pow((ads_coord.radius/50     ),2)) ) {
                        createMarker({title:arr_data[i].title, lat: ads_coord.lat, lng: ads_coord.lng, icon:"//uwork.pp.ua"+  getValue($scope.category, arr_data[i].category )[0].mini_icon });
                    }
                    //$scope.map.setCenter(my_coord);
                    createMarker({title:"вы тут", lat: my_coord.lat, lng: my_coord.lng});
                }

            });

            AdsService.getGeoLast(my_coord).then((resp) =>{
                var arr_data=resp.data.ads_rows;

                $scope.map.setCenter(my_coord);
                $scope.map.setZoom(15);

                var createMarker = function (info){
                    var marker = new google.maps.Marker({
                            map: $scope.map1,
                            position: new google.maps.LatLng(info.lat, info.lng),
                            title: info.title,
                            icon: info.icon,
                            labelContent: '<i  style="color:rgba(153,102,102,0.8);"></i>',
                            labelAnchor: new google.maps.Point(22, 50)
                        });


                    $scope.markers.push(marker);
                };
                function getValue(array, value) {
                    var obj = array.filter(function(arr, i){
                        if (arr.id == value ) { return i }
                    });
                    return obj;
                }


                for ( var i=0; arr_data.length > i; i++){

                    var geo={};
                    try { geo = JSON.parse(arr_data[i].geo); }
                    catch (err) { geo={} }

                    ads_coord = JSON.parse(arr_data[i].geo);

                    if (! isNaN( arr_data[i].category) )
                        icon  = "//uwork.pp.ua" + getValue($scope.category, arr_data[i].category)[0].mini_icon
                    else
                        icon = "//uwork.pp.ua/upload/icon_category_map/work_internet.png"

                        createMarker({
                            title: arr_data[i].title,
                            lat: ads_coord.lat,
                            lng: ads_coord.lng,
                            icon:icon
                        });

                }
                var index=0;
                $scope.map1.setZoom(15);
                setInterval(function (){
                    function ttt() {
                        var geo = JSON.parse(arr_data[index].geo)
                        index++;
                        if (index >= arr_data.length) index = 0;
                        $scope.map1.panTo({lat: geo.lat, lng: geo.lng});
                        return index;
                    };
                    index = ttt(index);
                },5000)
            })

        },function (err) {
            console.log("error geo:",err);
            alert(err.message);
        });
    } else {
        alert("geo недоступно...")
    }


});