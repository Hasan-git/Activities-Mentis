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
    ;


}


angular
    .module('active')
    .config(config)
    .run(function ($rootScope, $state, $location, currentUser, dataInitializer) {

        
        $rootScope.$state = $state;
        $rootScope.offline = false;
        $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
            
            $rootScope.previousState_name = from.name;
            $rootScope.previousState_params = fromParams;

            if (to.name == "inner.main_page") {
                $rootScope.back = false;
            } else {
                $rootScope.back = true;
                $rootScope.previousState = from.name;
                $rootScope.back = function () {
                    $state.go($rootScope.previousState_name, $rootScope.previousState_params);
                };
            }

            var user = currentUser.getProfile();
            if (user.isLoggedIn === false) {
                $location.path('home/login');
            } else {
                $rootScope.offline = true;
            }
        });

        //dataInitializer.destroyRepo();

        dataInitializer.checkRepo().then(function(data) {
            console.log( data);
        },function(err) {
            console.log(err);
            dataInitializer.initialize().then(function (success) {
                console.log(success);
            }, function (error) {
                console.log(error);
            });
        });
        var deviceHeight = $(window).height();
        $('.mainContainer').css({ 'height': (deviceHeight) + 'px' });

        

    });// End Run