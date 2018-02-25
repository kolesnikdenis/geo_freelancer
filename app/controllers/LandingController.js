angular.module('app').controller('LandingController', function($location, $scope, LandingService,AdsService,UserService) {
    $scope.category={};
    LandingService.getAll().then((category) => {
        $scope.category = category.data.response;
        $(document).ready(function(){
            $(".owl-carousel").owlCarousel({
                items:4,
                loop:true,
                margin:10,
                nav:false,
                responsiveClass:true,
                merge: true,
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
        $location.path("/extendedSearch/" + queryString);
    }

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
                         var name = resp_user.data.user_find.surname + " " + resp_user.data.user_find.firstname;
                         var mail= resp_user.data.user_find.mail;
                         var photo= "";

                         if ( JSON.parse(resp_user.data.user_find.photos) && JSON.parse(resp_user.data.user_find.photos)[0] && JSON.parse(resp_user.data.user_find.photos)[0].filename ) {
                             photo = '<img src="/upload/' +JSON.parse(resp_user.data.user_find.photos)[0].filename+'" width="50px"><br>' ;
                         }

                        marker.content = '<div class="infoWindowContent"> user id: ' + name + '<br>mail: <a href="mailto:' + mail +'">mail</a> <br></div>'  +
                            photo+
                            '<div width="20px">Ration: <span class="glyphicon glyphicon-star"></span>'+resp_user.data.user_find.rating+'<div class="progress" style="height: 10px;">\n' +
                            '<div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="height: 10px; width: '+resp_user.data.user_find.rating+'%">\n' +
                            '<span class="sr-only">'+resp_user.data.user_find.rating+'%</span>\n' +
                            ''+
                            '</div>' +
                            '</div></div>'+
                            '<button class="btn btn-success">send msg to user</button><button class="btn btn-success">show profile touser</button>'
                        google.maps.event.addListener(marker, 'click', function () {
                            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
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