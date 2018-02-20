angular.module('app').controller('ExtendedSearchController', function(AdsService) {
    AdsService.getAll().then((resp) => {
        this.ads = resp.data.ads_rows;
    }).then(() => {
        this.priceSlider.maxValue = this.getMaxPrice(this.ads);
        this.experienceSlider.maxValue = this.getMaxExperience(this.ads);
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
});