function fixDigit() {
    return function(x) {
        
         var res = x.toFixed(1);
         return res;
    };
}

angular
    .module('active')
    .filter('fixDigit', fixDigit)
;