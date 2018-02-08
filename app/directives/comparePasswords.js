angular.module('app').directive('comparePasswords', function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=comparePasswords"
        },
        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.comparePasswords = function(modelValue) {
                return modelValue === scope.otherModelValue.$modelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
});

