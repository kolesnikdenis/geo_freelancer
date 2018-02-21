angular.module('app').directive('checkImage', function($http) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {

            attrs.$observe('ngSrc', function(ngSrc) {
                $http.get(ngSrc).then(function(){
                    if (ngSrc == "") {element.attr('src', 'http://upload.wikimedia.org/wikipedia/commons/7/73/Lion_waiting_in_Namibia.jpg'); }
                },function(){
                    element.attr('src', 'http://upload.wikimedia.org/wikipedia/commons/7/73/Lion_waiting_in_Namibia.jpg'); // set default image
                });
            });
        }
    };
});