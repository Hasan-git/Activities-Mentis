

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

function login($scope, loginService, $location, currentUser, $state, $rootScope, toaster, notificationsRepo) {


    //notificationsRepo.getNotificationsByUserId(1).then(function (data) {
    //    console.log(data);
    //    notificationsRepo.setNewNotification(3, 1).then(function (saved) {
    //        console.log(saved);
    //        notificationsRepo.getNotificationsByUserId(1).then(function(da) {
    //            console.log(da);
    //        });
           
    //    }, function (err) { console.log(err); });
        
    //});
  
   
    $scope.username = "json";
    $scope.password = "abc123";
    $scope.submitLogin = function () {
        var username = $scope.username;
        var password = $scope.password;
        
        loginService.check(username, password).then(function(data) {
            currentUser.setProfile(data.username, data.id, data.name);
            $rootScope.globalName = data.name;
            //$state.go('inner.main_page');
            $state.go('inner.q1');
        }, function (error) {
            toaster.pop('error', "Notification", "Wrong Username or Password !", 3000);
            
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
    $scope.date = new Date();
    $scope.today();
}
function activitiesExposition($scope) {
    $scope.active = "Am here";
   
   
}
function centers($scope, resolvedcenters, $rootScope) {

   
    $scope.sortType = 'latLng';
    $scope.sortReverse = false;

    $scope.centers = resolvedcenters;
    $rootScope.centersz = resolvedcenters;
    $scope.s = function (center) {
            var str="";
            var max = 2;
            var keepGoing = true;
            angular.forEach(center.activities, function (value, key) {
                if (keepGoing) {
                    var length = center.activities.length;
                    if (key + 1 <= max) {
                        if (value.title !== null) {
                            str += value.title + " ";
                        }
                    } else {
                        var more = length - max;
                        str += " (+ " + more + " more)";
                        keepGoing = false;
                    }
                }
            });
            return str;
    }
    $scope.len = function (center) {

        var len = center.activities.length;
       
        return len;
    }

   

}

function activitiesList($scope, activitiesRepo, $rootScope, $filter) {
    activitiesRepo.getAllActivities().then(function(data) {
        $scope.allActivities = data;
        $rootScope.allActivitiesz = data;
    });
    $scope.formatDate = function (date) {
        var dateOut = new Date(date);
        return dateOut;
    };
    $scope.sortType = 'latLng';
    $scope.sortReverse = false;
    //$rootScope.currentActivities = true;
    //$rootScope.currentVenues = false;
    
}

function activityDetails($scope, resolvedActivty, toaster, notificationsRepo, currentUser) {
    $scope.activityDetails = resolvedActivty;
    $scope.user = currentUser.getProfile();
    $scope.calling = function () {
        toaster.pop('info', "Notification", "<i class='fa fa-phone'>&nbsp;&nbsp;</i>Calling ...&nbsp; <i class='fa fa-spinner fa-pulse'></i>", 3000);
    }
   

    $scope.saveActivity = function (activityId,userId) {
        notificationsRepo.setNewNotification(activityId, userId).then(function (success) {
            toaster.clear();
            toaster.pop('success', "Notification", "Activity Saved !", 2000);
        }, function (error) {
            toaster.clear();
            toaster.pop('error', "Notification", error, 2000);
        });
        
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
        toaster.pop('info', "Notification", "<i class='fa fa-phone'>&nbsp;&nbsp;</i>Calling ...&nbsp; <i class='fa fa-spinner fa-pulse'></i>", 3000);
    }

}
function bookingEnrollment($scope, resolvedActivtyEnrollment,toaster) {
    toaster.pop('success', "Notification", "Activity booked successfully", 4000);
    $scope.enrolledActivity = resolvedActivtyEnrollment;
}
function map($scope, toaster, $stateParams, activitiesRepo) {
    
    toaster.pop('wait', "Notification", "Getting locations ", 2000);

    var defaultLocation = {
        latitude: 51.4992783,
        longitude: -0.1271826,
        formatted_address:"Westminster, London SW1H 0AD UK"
    };
    var destinationLocation = {
        latitude: "",
        longitude: "",
        formatted_address: "Adress"
    };
    var selectedMode = "DRIVING";
    $scope.travelMode = "DRIVING";
   
    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        
         //selectedMode = document.getElementById('mode').value !== "" ? document.getElementById('mode').value : "DRIVING";
        selectedMode = $scope.travelMode;

        directionsService.route({
            origin: new google.maps.LatLng(defaultLocation.latitude, defaultLocation.longitude),
            destination: new google.maps.LatLng(destinationLocation.latitude, destinationLocation.longitude),
            travelMode: google.maps.TravelMode[selectedMode]
            
        }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                $scope.travelMode = selectedMode;
                $scope.tripDetails = response.routes[0].legs[0];
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    function initMap() {

        var geocoder = new google.maps.Geocoder;
        //current Position
        navigator.geolocation.getCurrentPosition(function (pos) {
           // console.log(pos.coords);
            var lat = pos.coords.latitude;
            var lng = pos.coords.longitude;
            var latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };
            geocoder.geocode({ 'location': latlng }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var length = results.length - 1;
                    
                    if (results) {
                        var country = results[length].formatted_address;
                        if (country === "United Kingdom"){
                            defaultLocation.latitude = lat;
                            defaultLocation.longitude = lng;
                            defaultLocation.formatted_address = results[0].formatted_address;
                            alert("we are in UK");
                        } else {
                            toaster.clear();
                            //alert("You are not located in United Kingdom , so your location will be considered in UK");
                            toaster.pop('warning', "Notification", "You are not located in United Kingdom , so your location will be considered in UK", 6000);
                        }
                    } 
                } else {
                    alert('Geocoder failed due to: ' + status);
                }
            });
        }, function (error) {
            alert('Unable to get location: ' + error.message);
        });

        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 7,
            center: { lat: defaultLocation.latitude, lng: defaultLocation.longitude }
        });
        directionsDisplay.setMap(map);
        calculateAndDisplayRoute(directionsService, directionsDisplay);
        directionsDisplay.setPanel(document.getElementById('panel'));

        var onChangeHandler = function () {
            calculateAndDisplayRoute(directionsService, directionsDisplay);
            $scope.travelMode = document.getElementById('mode').value;
        };
        document.getElementById('mode').addEventListener('change', onChangeHandler);
    }

    if ($stateParams.center) {
        destinationLocation.latitude = $stateParams.center.latLng.latitude;
        destinationLocation.longitude = $stateParams.center.latLng.longitude;
        initMap();
        
    } else if ($stateParams.activityId) {
        activitiesRepo.getActivity($stateParams.activityId).then(function (activity) {
            destinationLocation.latitude = activity.latLng.latitude;
            destinationLocation.longitude = activity.latLng.longitude;
            destinationLocation.formatted_address = activity.street;
            
            initMap();
        });
    }
    
}//End map ctrl

function centerDetails($scope, resolvedCenterDetails,toaster) {
    $scope.oneAtATime = true;
    $scope.centerDetails = resolvedCenterDetails;
    $scope.calling = function () {
        toaster.pop('info', "Notification", "<i class='fa fa-phone'>&nbsp;&nbsp;</i>Calling ...&nbsp; <i class='fa fa-spinner fa-pulse'></i>", 3000);
    }
    $scope.formatDate = function (date) {
        var dateOut = new Date(date);
        return dateOut;
    };
    

    
}

function notification($scope, resolvedNotifications, notificationsRepo, toaster, $localForage) {

    $scope.notifications = resolvedNotifications[0];
    console.log($scope.notifications);
    $scope.removeRow = function (idx) {
        $scope.notifications.splice(idx, 1);
    };
    $scope.removeAll = function () {
        
        while ($scope.notifications.length>0) {
            $scope.notifications.splice(0, 1);
        }
    };
    $scope.removeAllnotifications = function () {
        
        //notificationsRepo.DeleteAllNotifications().then(function(response) {
        //    
        //});
        //$localForage.getItem('notification').then(function(data) {
        //    
        //    console.log(data);
        //});
        // $localForage.removeItem("notification").then(function(deleted) {});
        var a = [];
        $localForage.setItem("notification", a).then(function (deletedz) { });
        $localForage.getItem('notification').then(function (data) { console.log(data); });
        while ($scope.notifications.length > 0) {
            $scope.notifications.splice(0, 1);
        }
    };
    $scope.dismissNotification = function (notificationId, idx) {
        notificationsRepo.DeleteNotificationByUserId(notificationId).then(function(data) {
            $scope.notifications.splice(idx, 1);
        });
    }


}

function map_centers($scope, centersRepo) {



    var locations = [];
    centersRepo.getAllCenters().then(function(data) {
        
        angular.forEach(data, function(value,key) {
            var center = [];
            center.push(value.centerName, value.latLng.latitude, value.latLng.longitude);
            locations.push(center);
            console.log(locations);
            
        });
         
         
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 9,
            center: new google.maps.LatLng(locations[0][1], locations[0][2]),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var infowindow = new google.maps.InfoWindow();

        var marker, i;

        for (i = 0; i < locations.length; i++) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                map: map
            });

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent(locations[i][0]);
                    infowindow.open(map, marker);
                }
            })(marker, i));
        }
    });
    
}

angular
    .module('active')
    .controller('map', map)
    .controller('login', login)
    .controller('MainCtrl', MainCtrl)
    .controller('mainPage', mainPage)
    .controller('centers', centers)
    .controller('map_centers', map_centers)
    .controller('notification', notification)
    .controller('activitiesList', activitiesList)
    .controller('activityDetails', activityDetails)
    .controller('centerDetails', centerDetails)
    .controller('bookingLicence', bookingLicence)
    .controller('bookingEnrollment', bookingEnrollment)
    .controller('activitiesExposition', activitiesExposition)
    ;