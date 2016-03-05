var myapp = angular.module('active');
myapp.directive('resize', function ($window) {
    return function (scope, element, attr) {
        var w = angular.element($window);
        var iW = element.innerWidth();
        var iH = element.innerHeight();
        scope.containerWidth  = iW;
        scope.containerHeight = iH;
        var resized = function() {
            iW = element.innerWidth();
            iH = element.innerHeight();
            scope.containerWidth = iW;
            scope.containerHeight = iH;
            scope.$apply();
        }
        w.on('resize', function () {
            resized();
        });

       // //Testing 
       // scope.$watch(
       //    function () {
       //        return [element[0].clientWidth, element[0].clientHeight].join('x');
       //    },
       //    function (value) {
       //        // console.log('directive got resized:', value.split('x'));
       //    }
       //);
    };
});


