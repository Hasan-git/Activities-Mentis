
function loginService(usersRepo) {

    var check = function (username, password) {

        var index=null;
        var users = usersRepo.getAllUsers();
        if (users) {
            angular.forEach(users, function (value, key) {
                if (value.username === username && value.password === password) {
                    index = key;
                }
            });
        }
        return index;
    }
    return {
        check: check
    }
}


function currentUser() {
    var profile = {
        isLoggedIn: false,
        username: "",
        index: ""
    };

    var setProfile = function (username, index) {
        profile.username = username;
        profile.index = index;
        profile.isLoggedIn = true;
    };

    var getProfile = function () {
        return profile;
    }

    return {
        setProfile: setProfile,
        getProfile: getProfile
    }
}


angular
.module('active')
.factory('currentUser', currentUser)
.factory('loginService', ['usersRepo', loginService]);
