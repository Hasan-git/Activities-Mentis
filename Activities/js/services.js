
function loginService(usersRepo,$q){

    var check = function (username, password) {

        var index = null;
        var deferred = $q.defer();
        var users = usersRepo.getAllUsers();
        users.then(function (object){
            if (object) {
                angular.forEach(object, function (identity, key) {
                    if (identity.username === username && identity.password === password) {
                        deferred.resolve({ username: identity.username, id: identity.userId,name:identity.name });
                    }
                });
                deferred.reject('Wrong username or password');
            }
        },function(error) {
            deferred.reject();
        });
        return deferred.promise;
    }
    return {
        check: check
    }
}// End Login Service


function currentUser() {
    var profile = {
        isLoggedIn: false,
        username: "",
        name: "",
        id: ""
    };

    var setProfile = function (username, id,name) {
        profile.username = username;
        profile.id = id;
        profile.name = name;
        profile.isLoggedIn = true;
    };

    var getProfile = function () {
        return profile;
    }

    return {
        setProfile: setProfile,
        getProfile: getProfile
    }
}//End currentUser


angular
.module('active')
.factory('currentUser', currentUser)
.factory('loginService', ['usersRepo','$q', loginService]);
