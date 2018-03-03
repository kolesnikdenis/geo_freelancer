angular.module('app').controller('PostAdController', function($location, AdsService, Categories, notify) {
    this.categories = Categories;

    this.postAd = function(adType, title, category, payment, experience, phone, description) {
        const adData = {
            title: title,
            category: category,
            price: payment,
            experience: experience,
            phone: phone,
            description: description,
            adType: adType
        };

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