angular.module('app').controller('PostAdController', function($scope,$location, AdsService, Categories, notify) {
    this.categories = Categories;

    $scope.Circles;
    $scope.places;
    $scope.markers;

    $scope.point={};
    this.point={};
    var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(50.047634, 36.421734),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }
    this.map = new google.maps.Map(document.getElementById('postAdMap'), mapOptions);
    var infoWindow = new google.maps.InfoWindow();
    $scope.slider = {
        value: 0.1,
        options: {
            ceil: 10,
            step: 0.1,
            precision: 1,
            onChange: ()=> {
                if ( $scope.markers ) {
                    $scope.places.radius = $scope.slider.value;
                    $scope.Circles.setRadius($scope.slider.value*1000);
                    this.point['radius']=($scope.slider.value*1000);
                }
            },

        }
    };

    var createCircle = (info) => {
        var Circle = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map: this.map,
            center: new google.maps.LatLng(info.lat, info.lng),
            radius: info.radius * 1000
        });
        $scope.Circles=Circle;
        $scope.point['c']=$scope.Circles;
        $scope.point['lat']=info.lat;
        $scope.point['lng']=info.lng;
        $scope.point['radius']=info.radius;

    };


    var createMarker = (info,index)=>{;
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
            map: this.map,
            position: new google.maps.LatLng(info.lat, info.lng),
            title: info.title,
            draggable: true,
            icon: pinSymbol(color),
        });
        marker.content = '<div id="'+index+'" class="infoWindowContent">' + info.desc + '</div>';
        google.maps.event.addListener(marker, 'click', function(){
            //this.marker_work.radius = info.radius;
            $scope.slider.value  = info.radius;
            //this.marker_work.title = info.title;
            //this.marker_work.desc = info.desc;
            //this.marker_work.id=places.indexOf(info);
            $scope.$apply();
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open(this.map, marker);
        });

        google.maps.event.addListener(marker,'dragend',function(event) {
            console.log($scope.markers );
            if ( $scope.markers ){
                    $scope.Circles.setCenter(this.position);
                    //places.lat = this.position.lat();
                    //places.lng= this.position.lng();
                    $scope.$apply();
                }
             });
        $scope.markers = marker;
        $scope.point['m']=marker;
    };


    google.maps.event.addListener(this.map, 'click', (event) =>{

        $scope.places=
            {
                title : 'работа тут',
                desc : 'тут',
                lat : event.latLng.lat(),
                lng : event.latLng.lng(),
                radius:  $scope.slider.value
            };
        if ($scope.point.m ) {
            $scope.point.m.setMap(null);
            $scope.point.c.setMap(null);
        }
        this.point['lat']  = $scope.places.lat
        this.point['lng']  = $scope.places.lng
        this.point['radius']  = $scope.places.radius
        this.point['lng'] = $scope.places.lng;
        createMarker($scope.places);
        createCircle($scope.places);
        $scope.$apply();
    });



    this.postAd = function(adType, title, category, payment, experience, phone, description,geo) {
        const adData = {
            title: title,
            category: category,
            price: payment,
            experience: experience,
            phone: phone,
            description: description,
            adType: adType,
            geo: JSON.stringify(this.point),
        };
        console.log(adData );

        AdsService.createNewAd(adData).then((response) => {
            if (response.data.status === 'ok') {
                notify({
                    message: 'Спасибо что оставили объявление!',
                    duration: 10000,
                    classes: 'alert alert-success'
                });
                $location.path("/");
            }
            else {
                notify({
                    message: 'Произошла ошибка, попробуйте позже',
                    classes: 'alert alert-danger',
                    duration: 0,
                });
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
});