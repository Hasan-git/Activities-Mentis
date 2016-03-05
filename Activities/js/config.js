function config($stateProvider, $urlRouterProvider) {
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
    ;


}


angular
    .module('active')
    .config(config)
    .run(function ($rootScope, $state,$location,currentUser) {
        $rootScope.$state = $state;
        $rootScope.offline = false;
        $rootScope.$on('$stateChangeStart', function (event) {
            var user = currentUser.getProfile();
            if (user.isLoggedIn === false) {
                $location.path('home/login');
            } else {
                $rootScope.offline = true;
            }
                
        });

       

    });