function config($stateProvider, $urlRouterProvider, $localForageProvider) {

    $localForageProvider.config({
        name: 'active', // name of the database and prefix for your data
        driver: 'localStorageWrapper'
    });

    $urlRouterProvider.otherwise("/home/landingPage");
    $stateProvider

        .state('home', {
            abstract: true,
            url: "/home",
            templateUrl: "views/common/content.html",
            loginRequired: false
        })
        .state('home.landingPage', {
            url: "/landingPage",
            templateUrl: "views/landingPage.html",
            controller: landingPage,
            loginRequired: false
        })
        .state('home.login', {
            url: "/login",
            templateUrl: "views/login.html",
            controller: login,
            loginRequired: false
        })
        .state('home.register', {
            url: "/register",
            templateUrl: "views/register.html",
            controller: register,
            loginRequired: false
        })
        .state('inner', {
            abstract: true,
            url: "/inner",
            templateUrl: "views/common/content.html",
            loginRequired: true
        })
        .state('inner.main_page', {
            url: "/main_page",
            templateUrl: "views/main_page.html",
            controller: mainPage,
            loginRequired: true
        })
        .state('inner.q1', {
            url: "/q1",
            templateUrl: "views/q1.html",
            loginRequired: true
        })
        .state('inner.q2', {
            url: "/q2",
            templateUrl: "views/q2.html",
            loginRequired: true
        })
        .state('inner.q3', {
            url: "/q3",
            templateUrl: "views/q3.html",
            loginRequired: true
        })
        .state('inner.calendar', {
            url: "/calendar",
            templateUrl: "views/calendar.html",
            controller: calendar,
            loginRequired: true
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
            },
            loginRequired: true

        })
        .state('inner.activitiesExposition', {
            url: "/activitiesExposition",
            templateUrl: "views/activitiesExposition.html",
            controller: activitiesExposition,
            loginRequired: true
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
            },
            loginRequired: true
        })
        .state('inner.activitiesExposition.activities', {
            url: "/activities",
            templateUrl: "views/activities.html",
            controller: activitiesList,
            loginRequired: true
        })
        .state('inner.centerDetails', {
            url: "/centerDetails/:center",
            templateUrl: "views/centerDetails.html",
            controller: centerDetails,
            //resolve: {
            //    resolvedCenterDetails: function ( $stateParams) {
            //        if ($stateParams.center != null) {
            //            return $stateParams.center;
            //        }
            //    }
            //}
            resolve: {
                resolvedCenterDetails: function ($stateParams, centersRepo) {
                    if ($stateParams.center != null) {
                        return centersRepo.getCenterWithActivities($stateParams.center).then(function (data) {
                            return data;
                        });
                    }
                }
            },
            loginRequired: true

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
            },
            loginRequired: true
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
            },
            loginRequired: true
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
        },
        loginRequired: true
    })
    .state('inner.map', {
        url: "/map?center&activityId",
        templateUrl: "views/map.html",
        controller: map,
        loginRequired: true
    })
    .state('inner.map_centers', {
        url: "/map_centers",
        templateUrl: "views/map_centers.html",
        controller: map_centers,
        loginRequired: true
    })
    ;


}


angular
    .module('active')
    .config(config)
    .run(function ($rootScope, $state, $location, currentUser, dataInitializer,toaster) {

        var postLogInRoute;

        $rootScope.$state = $state;
       
        $rootScope.offline = false;

        $rootScope.$on('$locationChangeSuccess', function(evt) {
            $rootScope.urlState = $state.current.name;
        });


        $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {

            toaster.clear();
            $rootScope.previousState_name = from.name;
            $rootScope.previousState_params = fromParams;
            
            

            if (to.name === "inner.main_page") {
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
                        $rootScope.currentActivities = false;
                        $rootScope.currentVenues = true;
                        break;
                    case 'inner.centerDetails':
                        a = "inner.activitiesExposition.centers";
                        break;
                    case 'inner.activitiesExposition.activities':
                        a = "inner.main_page";
                        $rootScope.currentActivities = true;
                        $rootScope.currentVenues = false;
                        break;
                    case 'inner.activityDetails':
                        a = "inner.activitiesExposition.activities";
                        params = toParams;
                        break;
                    
                    case 'inner.bookinglicence':
                        a = "inner.activityDetails";
                        params = toParams;
                        break;
                    case 'inner.bookingEnrollment':
                        a = from.name;
                        if (from.name !== "bookinglicence") {
                            a = "inner.activitiesExposition.activities";
                        }
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

                if (to.name !== 'home.login') {
                    if (to.loginRequired === true && toParams != null) {
                        $rootScope.tostate = to.name;
                        $rootScope.tostateParams = toParams;
                        $location.path('home/login');
                    } else {
                        $rootScope.tostate = false;
                        $rootScope.tostateParams = false;
                        $location.path('home/landingPage');
                    }
                 
                }
               
              // $location.path('home/login');
              // $location.path('home/landingPage');
            } else {
                $rootScope.offline = true;
                
            }
            $rootScope.headerOff = to.loginRequired === true ? true : false;
            ////if login required and you're logged out, capture the current path
            //if ((from.loginRequired && user.isLoggedIn === false) || user.isLoggedIn === false) {
            //    console.log(from);
            //  //  $location.path('home/login');
                
            //    //$state.go('home.login');

            //} 


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