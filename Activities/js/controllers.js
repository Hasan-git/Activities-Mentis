﻿

function MainCtrl($scope) {

    $scope.resizeContainer = function (dir) {
        var widthPx = $('.mainContainer').width();
        var parent = $('.mainContainer').parent();
        var val = Math.ceil(widthPx / parent.width() * 100);
        
        if (val <= 98 && dir === 'inc') {
            $('.mainContainer').css({ 'width': (val + 4) + "%" });
            $scope.containerWidth = $('.mainContainer').width();
            $scope.containerHeight = $('.mainContainer').height();
        } else if (val >= 2 && dir === 'dec') {
            if (widthPx > 395)
                $('.mainContainer').css({ 'width': val + "%" });

            $scope.containerWidth = $('.mainContainer').width();
            $scope.containerHeight = $('.mainContainer').height();
        }
    }
}//End MainCtrl

function login($scope, loginService, $location, currentUser, $state, usersRepo, $localForage) {

  
    $scope.username = "json";
    $scope.password = "abc123";
    $scope.submitLogin = function () {
        var username = $scope.username;
        var password = $scope.password;
        
        
        loginService.check(username, password).then(function(data) {
            currentUser.setProfile(data.username, data.id);
            $state.go('inner.main_page');
        }, function(error) {
            alert(error);
        });

        //if (index === null) {
        //    //notification wrong password username
        //    alert("Wrong username or password");
        //} else {
        //    currentUser.setProfile(username, index);
        //    //go to HomePage
        //    $state.go('inner.main_page');
        //}
    }
}//End Login

function mainPage($scope) {

}

function calendar($scope) {
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();
}


angular
    .module('active')
    .controller('login',login)
    .controller('MainCtrl', MainCtrl)
    .controller('mainPage', mainPage)
    ;