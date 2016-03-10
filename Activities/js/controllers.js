

function MainCtrl($scope, $window) {
    
    $scope.resizeContainer = function (dir) {
        
        var minWidth = 360;
        var maxWidth = 1300;
        var range = 40;
        var widthPx = $('.mainContainer').innerWidth();
        $scope.e = widthPx + range;
        var uiwidth = $('.uiview').innerWidth();
        var doc = $($window).innerWidth();
        var parent = $('.mainContainer').parent();
        var val = Math.ceil(widthPx / parent.width() * 100);
        
        if ( dir === 'inc') {
            //var settingInc = (widthPx + range) > windowWidth ? windowWidth : (widthPx + range);
            if ((widthPx + range) > doc) {
                $('.mainContainer').css({ 'width': (doc) + 'px' });
            } else if ((widthPx + range) < doc) {
                var v = parseInt(widthPx) + parseInt(range);
                $('.mainContainer').css({ 'width': (widthPx + 80) + 'px' });
            }
            $scope.containerWidth = $('.mainContainer').innerWidth();
            $scope.containerHeight = $('.mainContainer').innerWidth();
        } else if (dir === 'dec') {
            if ((widthPx - range) < minWidth) {
                $('.mainContainer').css({ 'width': minWidth+'px' });
            } else if ((widthPx - range) > 320) {
                $('.mainContainer').css({ 'width': (widthPx - range) + "px" });
            } 
            $scope.containerWidth = $('.mainContainer').innerWidth();
            $scope.containerHeight = $('.mainContainer').innerWidth();
        }
    }
}//End MainCtrl

function login($scope, loginService, $location, currentUser, $state,$rootScope) {
    
    $scope.username = "json";
    $scope.password = "abc123";
    $scope.submitLogin = function () {
        var username = $scope.username;
        var password = $scope.password;
        
        loginService.check(username, password).then(function(data) {
            currentUser.setProfile(data.username, data.id, data.name);
            $rootScope.globalName = data.name;
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

function mainPage($scope,$state) {
    
}

function calendar($scope, activitiesRepo) {
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();
}
function activitiesExposition($scope) {
    $scope.active = "Am here";
}
function centers($scope, activitiesRepo) {
   
        activitiesRepo.getAllCentersActivities().then(function (res) {
            $scope.activities = res[0];
        });
}

function activitiesList($scope, activitiesRepo) {
    activitiesRepo.getAllActivities().then(function(data) {
        $scope.allActivities = data;
    });
    $scope.sortType = 'name'; 
    $scope.sortReverse = false;  
}

function activityDetails($scope, resolvedActivty,toaster) {
    $scope.activityDetails = resolvedActivty;
    $scope.saveActivity = function() {
        toaster.pop('success', "Notification", "Activity Saved !", 4000);
    }
}

function bookingLicence($scope, $rootScope, resolvedActivtyz, bookedActivitiesRepo, currentUser, toaster,$state) {

    $scope.activityDetails = {};
    $scope.activityDet = resolvedActivtyz;
    
    $scope.bookingActivity = function (activityId) {
       
        if (activityId != null && activityId !== 0) {
            var user = currentUser.getProfile();
            bookedActivitiesRepo.setNewBookedActivity(activityId,user.id).then(function (response) {
                $state.go("inner.bookingEnrollment", { activityId: activityId });
            }, function (err) {
                toaster.pop('error', "Notification", "Already Purchased", 4000);
            });
        }
    }
    $scope.calling = function() {
        toaster.pop('info', "Notification", "<i class='fa fa-phone'>&nbsp;&nbsp;</i>Calling ...&nbsp; <i class='fa fa-spinner fa-pulse'></i>", 6000);
    }

}
function bookingEnrollment($scope, resolvedActivtyEnrollment,toaster) {
    toaster.pop('success', "Notification", "Activity booked successfully", 4000);
    $scope.enrolledActivity = resolvedActivtyEnrollment;
}

angular
    .module('active')
    .controller('login',login)
    .controller('MainCtrl', MainCtrl)
    .controller('mainPage', mainPage)
    .controller('centers', centers)
    .controller('activitiesList', activitiesList)
    .controller('activityDetails', activityDetails)
    .controller('bookingLicence', bookingLicence)
    .controller('bookingEnrollment', bookingEnrollment)
    .controller('activitiesExposition', activitiesExposition)
    ;