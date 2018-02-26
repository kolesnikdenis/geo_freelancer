angular.module('app').controller('ExtendedSearchController', function($routeParams, $scope, AdsService) {
    this.adsMarkers = [];
    AdsService.getAll().then((resp) => {
        this.ads = resp.data.ads_rows;
    }).then(() => {
        this.priceSlider.maxValue = this.getMaxPrice(this.ads);
        this.experienceSlider.maxValue = this.getMaxExperience(this.ads);
    }).then(() => {
        $scope.$watchCollection( () => $scope.filterAds.map((ad) => ad.id),
            () => {
                this.adsMarkers = $scope.filterAds.map(createMarker);
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
        value: 500,
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
        events: {},
        coords: {}
    };
    this.mapCircle = {
        center: { latitude: 45, longitude: -73 },
        radius: 500,
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
        }
    );

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((location) => {
            this.currentPosMarker.coords = {latitude: location.coords.latitude, longitude: location.coords.longitude};
            this.mapCircle.center = this.currentPosMarker.coords;
            this.map.center = {latitude: location.coords.latitude, longitude: location.coords.longitude};
            this.map.zoom = 15;
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
});