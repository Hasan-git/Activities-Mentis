function config($stateProvider, $urlRouterProvider, $localForageProvider) {

    $localForageProvider.config({
        name: 'active', // name of the database and prefix for your data
        driver: 'localStorageWrapper'
    });

    $urlRouterProvider.otherwise("/home/login");
    $stateProvider

        .state('home', {
            abstract: true,
            url: "/home",
            templateUrl: "views/common/content.html"
        })
        .state('home.login', {
            url: "/login",
            templateUrl: "views/login.html",
            controller: login
        })
        .state('inner', {
            abstract: true,
            url: "/inner",
            templateUrl: "views/common/content.html"
        })
        .state('inner.main_page', {
            url: "/main_page",
            templateUrl: "views/main_page.html",
            controller: mainPage
        })
        .state('inner.calendar', {
            url: "/calendar",
            templateUrl: "views/calendar.html",
            controller: calendar
        })
        .state('inner.notification', {
            url: "/notification",
            templateUrl: "views/notification.html",
            controller: notification,
            resolve: {
                resolvedNotifications: function (notificationsRepo, currentUser) {
                    var user = currentUser.getProfile();
                    
                        return notificationsRepo.getNotificationsByUserId(user.id).then(function (data) {
                            return data;
                        });
                }
            }

        })
        .state('inner.activitiesExposition', {
            url: "/activitiesExposition",
            templateUrl: "views/activitiesExposition.html",
            controller: activitiesExposition
        })
        .state('inner.activitiesExposition.centers', {
            url: "/activitiesExposition",
            templateUrl: "views/centers.html",
            controller: centers,
            resolve: {
                resolvedcenters: function (centersRepo) {
                    return centersRepo.getCentersInjActivities().then(function (data) {
                            return data;
                        });
                }
            }
        })
        .state('inner.activitiesExposition.activities', {
            url: "/activities",
            templateUrl: "views/activities.html",
            controller: activitiesList
        })
        .state('inner.centerDetails', {
            url: "/centerDetails/:center",
            templateUrl: "views/centerDetails.html",
            controller: centerDetails,
            resolve: {
                resolvedCenterDetails: function ( $stateParams) {
                    if ($stateParams.center != null) {
                       
                       
                        return $stateParams.center;
                    
                    }
                }
            }

        })
        .state('inner.activityDetails', {
            url: "/activityDetails/:activityId",
            templateUrl: "views/activityDetails.html",
            controller: activityDetails,
            resolve: {
                resolvedActivty: function (activitiesRepo, $stateParams) {
                    if ($stateParams.activityId != null || $stateParams.activityId !== 0) {
                        var id = $stateParams.activityId;
                        return activitiesRepo.getActivity(id).then(function (data) {
                            return data;
                        });
                    } else {
                        return null;
                    }
                }
            }
        })
        .state('inner.bookinglicence', {
            url: "/bookinglicence/:activityId",
            templateUrl: "views/bookinglicence.html",
            controller: bookingLicence,
            resolve: {
                resolvedActivtyz: function (activitiesRepo, $stateParams) {
                    if ($stateParams.activityId != null || $stateParams.activityId !== 0) {
                        var id = $stateParams.activityId;
                        return activitiesRepo.getActivity(id).then(function (data) {
                            return data;
                        });
                    } else {
                        return null;
                    }
                }
            }
        })
    .state('inner.bookingEnrollment', {
        url: "/bookingEnrollment/:activityId",
        templateUrl: "views/bookingEnrollment.html",
        controller: bookingEnrollment,
        resolve: {
            resolvedActivtyEnrollment: function (activitiesRepo, $stateParams) {
                if ($stateParams.activityId != null || $stateParams.activityId !== 0) {
                    var id = $stateParams.activityId;
                    return activitiesRepo.getActivity(id).then(function (data) {
                        return data;
                    });
                } else {
                    return null;
                }
            }
        }
    })
    .state('inner.map', {
        url: "/map?center&activityId",
        templateUrl: "views/map.html",
        controller: map
    })
    .state('inner.map_centers', {
        url: "/map_centers",
        templateUrl: "views/map_centers.html",
        controller: map_centers
    })
    ;


}


angular
    .module('active')
    .config(config)
    .run(function ($rootScope, $state, $location, currentUser, dataInitializer,toaster) {

        
        $rootScope.$state = $state;
        $rootScope.offline = false;
        $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {

            toaster.clear();
            $rootScope.previousState_name = from.name;
            $rootScope.previousState_params = fromParams;
            

            if (to.name == "inner.main_page") {
                $rootScope.back = false;
            } else {
                $rootScope.back = true;
                var a;
                var params;
                switch (to.name) {
                    case 'inner.calendar':
                        a = from.name;
                        params = fromParams;
                        if (a === 'inner.notification') {
                            a = 'inner.main_page';
                        }
                        break;
                    case 'inner.activitiesExposition':
                        a = "inner.main_page";
                        break;
                    case 'inner.activitiesExposition.centers':
                        a = "inner.main_page";
                        break;
                    case 'inner.centerDetails':
                        a = "inner.activitiesExposition.centers";
                        break;
                    case 'inner.activitiesExposition.activities':
                        a = "inner.main_page";
                        break;
                    case 'inner.activityDetails':
                        a = "inner.activitiesExposition.activities";
                        params = toParams;
                        break;
                    
                    case 'inner.bookinglicence':
                        a = "inner.activityDetails";
                        params = toParams;
                        break;
                    case 'inner.map':
                        a = from.name;
                        if (fromParams.activityId) {
                            params = { activityId: fromParams.activityId };
                        } else if (fromParams.center) {
                            params = { center: fromParams.center };
                        }
                        break;
                    default:
                        a = from.name;
                        params = toParams;
                    }
                $rootScope.back = function () {
                    $state.go(a, params);
                };
            }

            var user = currentUser.getProfile();
            if (user.isLoggedIn === false) {
                $location.path('home/login');
            } else {
                $rootScope.offline = true;
            }
        });

        $rootScope.destroyDataBase = function() { dataInitializer.destroyRepo(); };

        dataInitializer.checkRepo().then(function(data) {
            console.log("check", data);
        },function(err) {
            console.log(err);
            dataInitializer.initialize().then(function (success) {
                console.log("success",success);
            }, function (error) {
                console.log("error", error);
            });
        });
        var deviceHeight = $(window).height();
        $('.mainContainer').css({ 'height': (deviceHeight) + 'px' });

        

    });// End Run