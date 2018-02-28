angular.module('app').controller('ExtendedSearchController', function($routeParams, $scope, $uibModal, AdsService, UserService, AuthService, MsgService, notify) {
    this.adsMarkers = [];
    $scope.filterAds = [];

    AdsService.getAll().then((resp) => {
        this.ads = resp.data.ads_rows;
    }).then(() => {
        this.priceSlider.maxValue = this.getMaxPrice(this.ads);
        this.experienceSlider.maxValue = this.getMaxExperience(this.ads);
    }).then(() => {
        $scope.$watchCollection( () => $scope.filterAds.map((ad) => ad.id),
            () => {
                this.adsMarkers = $scope.filterAds.map(createMarker).filter(filterMarkerByRadius.bind(this));
            }
        );
    });

    this.getCategories = function(ads) {
        const categories = [];
        if (!ads) {
            return categories;
        }
        for (let i = 0; i < ads.length; i++) {
            if (!categories.includes(ads[i].category)) {
                categories.push(ads[i].category);
            }
        }
        return categories;
    };
    this.priceSlider = {
        minValue: 0,
        maxValue: 0,
    };
    this.experienceSlider = {
        minValue: 0,
        maxValue: 0,
    };
    this.radiusSlider = {
        value: 3000,
    };
    this.getMaxPrice = function(ads) {
        if (!ads) {
            return 0;
        }
        const prices = ads.map(function(ad) {
            return ad.price;
        });
        return Math.max(...prices);
    };

    this.getMaxExperience = function(ads) {
        if (!ads) {
            return 0;
        }
        const experienceLevel = ads.map(function(ad) {
            return ad.experience;
        });
        return Math.max(...experienceLevel);
    };

    this.byRange = function (fieldName, minValue, maxValue) {
        if (minValue === undefined) minValue = Number.MIN_VALUE;
        if (maxValue === undefined) maxValue = Number.MAX_VALUE;

        return function predicateFunc(item) {
            return minValue <= item[fieldName] && item[fieldName] <= maxValue;
        };
    };
    this.currentPage = 1;
    this.itemsPerPage = 3;

    this.search = $routeParams.queryString;

    this.map = {
        center: { latitude: 45, longitude: -73 },
        zoom: 8
    };
    this.currentPosMarker = {
        id: 0,
        options: { draggable: true },
        events: {
            dragend : () => {
                this.adsMarkers = $scope.filterAds.map(createMarker).filter(filterMarkerByRadius.bind(this));
            }
        },
        coords: { latitude: 45, longitude: -73 }
    };
    this.mapCircle = {
        center: { latitude: 45, longitude: -73 },
        radius: 3000,
        stroke: {
            color: '#08B21F',
            weight: 2,
            opacity: 1
        },
        fill: {
            color: '#08B21F',
            opacity: 0.5
        },
    };

    $scope.$watch( () => this.radiusSlider.value,
        (newValue) => {
            this.mapCircle.radius = newValue;
            this.adsMarkers = $scope.filterAds.map(createMarker).filter(filterMarkerByRadius.bind(this));
        }
    );

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((location) => {
            this.currentPosMarker.coords = {latitude: location.coords.latitude, longitude: location.coords.longitude};
            this.mapCircle.center = this.currentPosMarker.coords;
            this.map.center = {latitude: location.coords.latitude, longitude: location.coords.longitude};
            this.map.zoom = 10;
        }, (err) => {
            console.error('Failed to get current position', err);
        })
    }

    function createMarker(ad) {
        const geoInfo = JSON.parse(ad.geo);
        return {
            icon: '/assets/img/marker.png',
            latitude: geoInfo.lat,
            longitude: geoInfo.lng,
            title: ad.title,
            id: ad.id,
            options: {
                title: ad.title,
            }
        };
    }

    function filterMarkerByRadius (marker) {
        if (!marker.latitude) {
            return false;
        }
        const markerPos = new google.maps.LatLng(marker.latitude, marker.longitude);
        const currentPos = new google.maps.LatLng(this.currentPosMarker.coords.latitude, this.currentPosMarker.coords.longitude);
        const distance = google.maps.geometry.spherical.computeDistanceBetween(markerPos, currentPos);

        return distance <= this.mapCircle.radius;
    }

    this.radioModel = 'currentPos';

    UserService.requestUserInfo().then((response) => {
        const userGeo = JSON.parse(response.data.user_profile.geo);
        this.userProfileLocation = {latitude: userGeo[0].lat, longitude: userGeo[0].lng};
    }).then(() => {
        let currentCoords = null;
        $scope.$watch( () => this.radioModel,
            (newValue) => {
                if ((newValue === 'currentPos') && currentCoords) {
                    this.currentPosMarker.coords.latitude = currentCoords.latitude;
                    this.currentPosMarker.coords.longitude = currentCoords.longitude;
                    this.map.center.latitude = currentCoords.latitude;
                    this.map.center.longitude = currentCoords.longitude;
                    this.adsMarkers = $scope.filterAds.map(createMarker).filter(filterMarkerByRadius.bind(this));
                } else if (newValue === 'storedPos') {
                    currentCoords = { latitude:  this.currentPosMarker.coords.latitude, longitude: this.currentPosMarker.coords.longitude};
                    this.currentPosMarker.coords.latitude = this.userProfileLocation.latitude;
                    this.currentPosMarker.coords.longitude = this.userProfileLocation.longitude;
                    this.map.center.latitude = this.userProfileLocation.latitude;
                    this.map.center.longitude = this.userProfileLocation.longitude;
                    this.adsMarkers = $scope.filterAds.map(createMarker).filter(filterMarkerByRadius.bind(this));
                }
            }
        );
    });

    this.isAuthenticated = AuthService.isAuthenticated();

    this.openModal = function (ad) {
        const modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'sendMessageModal.html',
            scope: $scope,
            backdrop: true,
            controller: function($scope) {
                $scope.sendToUserId = ad.user_id;
            }
        });
        modalInstance.result.catch(() => modalInstance.close())
    };

    this.sendMessage = function (message, toUserId, closeModal) {
        const requestBody = {
            from_id: AuthService.getAuthData().user_id,
            to_user_id: toUserId,
            msg: message
        };
        MsgService.requestSendMsg(requestBody).then((resp) => {
            notify({
                message: 'Сообщение успешно отправлено',
                duration: 10000,
                classes: 'alert alert-success'
            });
            closeModal();
        })
        .catch((error) => {
            notify({
                message: 'Произошла ошибка, попробуйте позже',
                classes: 'alert alert-danger',
                duration: 0,
            });
        })
    };
});