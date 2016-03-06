
function users($localForage,$q) {

   
    

    var getAllUsers = function () {
        var users = [];
        var deferred = $q.defer();
        $localForage.getItem('users').then(function (data) {
            if (data)
                deferred.resolve(data);
            else
                deferred.reject();
        });
        return deferred.promise;
    }

    var getUser = function (id) {
        
        var deferred = $q.defer();
        if (!id)
            deferred.reject();

        getAllUsers().then(function (object) {
            if (object) {
                angular.forEach(object, function(identity, key) {
                    if (identity.userId === id) {
                        deferred.resolve(identity);
                    }
                });
            } else {
                deferred.reject();
            }
        });
        return deferred.promise;
    }

    return {
        getUser: getUser,
        getAllUsers: getAllUsers
    }
}



angular
.module('active')
.factory('usersRepo', users);
