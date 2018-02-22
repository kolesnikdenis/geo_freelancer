angular.module('app').controller('ProfileController', function($rootScope, $location, UserService, notify, AuthService) {

    $rootScope.marker_work={ radius: 1, title: "",desc: "",lat: 0, lng: 0,id:-1 };
    $rootScope.select_marker="null select marker";

    $rootScope.hidden_edit_component = function () {
        $rootScope.marker_work={ radius: 1, title: "",desc: "",lat: 0, lng: 0,id:-1 };
        console.log("null");
    }

    $rootScope.save_profile = function () {

        var update = {
            address: $rootScope.profile.address,
            apartment: $rootScope.profile.apartment,
            city: $rootScope.profile.city,
            description : $rootScope.profile.description,
            geo: JSON.stringify($rootScope.profile.geo),
            house: $rootScope.profile.house,
            patronymic:$rootScope.profile.patronymic ,
            phone:$rootScope.profile.phone ,
            surname: $rootScope.profile.surname,
            firstname: $rootScope.profile.firstname,
            //password: ""
        }
        UserService.requestUpdateUserInfo(update).then((response) => {
            console.log(response.data);
            if (response.data.status === 'ok') {
                notify({
                    message: 'успешно сохранено',
                    duration: 10000,
                    classes: 'alert alert-success'
                });

            } else {
                console.log("ne ok",response)
            }
        })
        .catch((error) => {
                notify({
                    message: 'Произошла ошибка, попробуйте позже',
                    classes: 'alert alert-danger',
                    duration: 0,
                });
            })
        }



    $rootScope.profile =
        {
            address: "адресс",
            apartment : "квартира",
            city :"город",
            description: "какой то текст" ,
            firstname: "имя",
            geo: "будет объект с адресами",
            house: "дом",
            patronymic: "отчество",
            phone: "телефон",
            surname:"фамилия",
        };
    this.getInfoUser = function() {
        if ( AuthService.isAuthenticated() ) {
            UserService.requestUserInfo(AuthService.getAuthData())
                .then((response) => {
                    if (response.data.status === 'ok') {
                        //AuthService.saveAuthData(response.data.user_profile.token, response.data.user_profile.mail);
                        $rootScope.profile=response.data.user_profile;
                        $rootScope.profile.geo = JSON.parse(response.data.user_profile.geo);
                        if ($rootScope.profile.geo.length>0 ){
                            for ( var i=0; i< $rootScope.profile.geo.length; i++){
                                places.push($rootScope.profile.geo[i]);
                                console.log($rootScope.profile.geo[i]);
                            }
                        } else {
                            $rootScope.profile.geo = places;
                        }
                        if ( places.length>0 ) {
                            $rootScope.profile.geo=places;
                            for (i = 0; i < places.length; i++) {
                                createMarker(places[i], i);
                                createCircle(places[i]);
                            }
                        }
                        $rootScope.$broadcast('authenticated');
                        notify({
                            message: 'данные пользователя в консоли))',
                            duration: 10000,
                            classes: 'alert alert-success'
                        });
                        console.log(response.data.user_profile)
                    }
                    else {
                        notify({
                            message: 'неведома ошибка',
                            classes: 'alert alert-danger',
                            duration: 11110,
                        });
                        console.log(response);
                    }
                })
                .catch((error) => {
                    notify({
                        message: 'Произошла ошибка, попробуйте позже',
                        classes: 'alert alert-danger',
                        duration: 0,
                    });
                })
        }
    };
    this.getInfoUser();
    $rootScope.add_my_geo = function () {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(location) {
                places.push(
                    {
                        title : 'Are you here!',
                        desc : 'measurement accuracy \ radius: '+location.coords.accuracy+"meters",
                        lat : location.coords.latitude,
                        lng : location.coords.longitude,
                        radius:  (location.coords.accuracy/1000),
                        color: '#70e470',
                    }
                );
                createMarker(places[places.length-1],places.length-1);
                createCircle(places[places.length-1]);
                $rootScope.$apply();
            },function (err) {
                console.log("error geo:",err);
                alert(err.message);
            });
        } else {
            alert("geo недоступно...")
        }

    }
    $rootScope.slider = {
        value: 0.1,
        options: {
            ceil: 10,
            step: 0.1,
            precision: 1,
            onChange: function() {
                if ( $rootScope.marker_work.id >= 0 ) {
                    places[$rootScope.marker_work.id].radius = $rootScope.slider.value;
                    $rootScope.Circle[$rootScope.marker_work.id].setRadius($rootScope.slider.value*1000);
                }
            },

        }
    };
    var places = [];

    $rootScope.places=places;
    var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(50.047634, 36.421734),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    $rootScope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $rootScope.markers = [];
    $rootScope.Circle = [];

    var infoWindow = new google.maps.InfoWindow();

    //добавить маркер
    google.maps.event.addListener($rootScope.map, 'click', function(event) {
        console.log("")
        places.push(
            {
                title : 'заголовок точки',
                desc : 'Описание точки',
                lat : event.latLng.lat(),
                lng : event.latLng.lng(),
                radius:  $rootScope.slider.value
            }
        );
        createMarker(places[places.length-1],places.length-1);
        createCircle(places[places.length-1]);
        $rootScope.$apply();
    });
    $rootScope.changeDesc = function(){
        places[$rootScope.marker_work.id].desc  = $rootScope.marker_work.desc;
        $rootScope.markers[$rootScope.marker_work.id].content=$rootScope.marker_work.desc;
    };
    $rootScope.changeTitle = function(){
        places[$rootScope.marker_work.id].title  = $rootScope.marker_work.title;
        $rootScope.markers[$rootScope.marker_work.id].title= $rootScope.marker_work.title;
    };
    var createCircle = function (info) {
        var color="";
        if ( info.color ) { color = info.color} else { color = "#FF0000";}
        //if ( info.title.indexOf("Дом") >=0 ) { color = "#00FF00";}
        var cityCircle = new google.maps.Circle({
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: 0.35,
            map: $rootScope.map,
            center: new google.maps.LatLng(info.lat, info.lng),
            radius: info.radius * 1000
        });
        $rootScope.Circle.push(cityCircle);
    };
    $rootScope.del_dot = function(index) {
        //console.log(index, "del dot");
        //arr.splice(index, 1);
        $rootScope.markers[index].setMap(null);
        $rootScope.Circle[index].setMap(null);
        $rootScope.markers.splice(index, 1);
        $rootScope.Circle.splice(index, 1);
        places.splice(index,1);

    };

    var createMarker = function (info,index){
        function pinSymbol(color) {
            return {
                path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
                fillColor: color,
                fillOpacity: 1,
                strokeColor: '#000',
                strokeWeight: 2,
                scale: 1,
            };
        }
        var color="";
        if ( info.color ) { color = info.color} else { color = "#FF0000";}
        var marker = new google.maps.Marker({
            map: $rootScope.map,
            position: new google.maps.LatLng(info.lat, info.lng),
            title: info.title,
            draggable: true,
            icon: pinSymbol(color),
        });
        marker.content = '<div id="'+index+'" class="infoWindowContent">' + info.desc + '</div>';
        google.maps.event.addListener(marker, 'click', function(){
            $rootScope.select_marker = marker.title;
            $rootScope.marker_work.radius = info.radius;
            $rootScope.slider.value  = info.radius;
            $rootScope.marker_work.title = info.title;
            $rootScope.marker_work.desc = info.desc;
            $rootScope.marker_work.id=places.indexOf(info);
            $rootScope.$apply();
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($rootScope.map, marker);
        });

        google.maps.event.addListener(marker,'dragend',function(event) {
            for ( i =0; i < $rootScope.markers.length; i++){
                if ( marker.title == $rootScope.markers[i].title && marker.content== $rootScope.markers[i].content){
                    $rootScope.Circle[i].setCenter(this.position);
                    places[i].lat = this.position.lat();
                    places[i].lng= this.position.lng();
                    $rootScope.$apply();
                }
            }
        });
        $rootScope.markers.push(marker);
    };
    if ( places.length>0 ) {
        for (i = 0; i < places.length; i++) {
            createMarker(places[i], i);
            createCircle(places[i]);
        }
    }
    function addMarker(location, title, map) {
        var marker = new google.maps.Marker({
            position: location,
            label: title,
            map: map
        });
    }
});
