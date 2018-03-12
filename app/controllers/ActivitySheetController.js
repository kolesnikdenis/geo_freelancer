angular.module('app').controller('ActivitySheetController', function($scope,$routeParams,AService,UserService,  $compile, $uibModal,AuthService,notify,$location) {
    this.user_id= $routeParams.id;
    this.activity_user =[];
    this.selectId=0;
    AService.getAdsUser(this.user_id).then((resp_user) => {
        this.activity_user= resp_user.data.ads_rows;

        for (var i=0; i < this.activity_user.length; i++){
            if ( this.activity_user[i] && this.activity_user[i].geo) {
                this.activity_user[i].geo = JSON.parse(this.activity_user[i].geo)
                /*if (this.geo.radius && this.geo.radius >0)
                    this.geo = this.photo[0].filename;
                else
                    this.geo = "logo-anonymous.png";*/
            }
        }
    });

    this.showactivity = function (id) {
        //setTimeout(()=>{this.selectId=-1; this.$apply;},5000);
        this.map1 = new google.maps.Map(document.getElementById('ActivityMap'), {
            zoom: 10,
            center: new google.maps.LatLng(50.047634, 36.421734),
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            disableDefaultUI: true
        });
        this.selectId=id;
        this.select_item=this.activity_user[id];
        console.log(id,this.select_item);
        notify({ message: "посмотрим id:"+id+" user:"+this.activity_user[id].id, duration: 3000, classes: 'alert alert-info'  });

        this.markers = [];
        var createMarker = (info,who_marker)=>{
            var marker="";
            if ( !who_marker ) {
                marker = new google.maps.Marker({
                    map: this.map1,
                    position: new google.maps.LatLng(info.lat, info.lng),
                    title: info.title,
                    icon: info.icon,
                    labelContent: '<i  style="color:rgba(153,102,102,0.8);"></i>',
                    labelAnchor: new google.maps.Point(22, 50)
                });
            } else {
                marker = new google.maps.Marker({
                    map: this.map1,
                    position: new google.maps.LatLng(info.lat, info.lng),
                    title: info.title,
                    animation: google.maps.Animation.DROP,
                });
                this.marker.setAnimation(google.maps.Animation.BOUNCE);
            }

            UserService.requestGetInfoAboutUser(this.select_item.user_id).then((resp_user) => {

                $scope.name = resp_user.data.user_find.surname + " " + resp_user.data.user_find.firstname;
                $scope.mail = resp_user.data.user_find.mail;
                $scope.photo ="";
                $scope.rating= resp_user.data.user_find.rating;
                $scope.id=resp_user.data.user_find.id;
                if ( JSON.parse(resp_user.data.user_find.photos) && JSON.parse(resp_user.data.user_find.photos)[0] && JSON.parse(resp_user.data.user_find.photos)[0].filename ) {
                    $scope.photo = JSON.parse(resp_user.data.user_find.photos)[0].filename ;
                }
                this.photo = $scope.photo;
                var html = "<ng-include src=\"'" + "/modals/marker/lending_marker_info.html" + "'\"></ng-include>";
                var div = $('<div>');
                div.html(html);
                var newElem = $compile(div)($scope);
                var infoWindow = new google.maps.InfoWindow();
                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.setContent('<h2>' + info.title + '</h2>' + marker.content);
                    infoWindow.setContent( newElem[0]),
                        infoWindow.open(this.map1, marker);
                });
                //this.markers.push(marker);
            })
            this.map1.setCenter(new google.maps.LatLng(info.lat, info.lng));
            this.map1.setZoom(15);

        };
        //this.select_item.geo = JSON.parse(this.select_item.geo);
        console.log(this.select_item.geo );
        createMarker({title:this.select_item.title, lat: this.select_item.geo.lat, lng: this.select_item.geo.lng, /*icon:"//uwork.pp.ua"+  getMarkerIcon($scope.category, arr_data[i].category )*/ });
        //createMarker({title:"вы тут", lat: my_coord.lat, lng: my_coord.lng});

    }
});
