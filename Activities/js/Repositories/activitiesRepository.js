
function activity($localForage, $q) {

    var getAllActivities = function () {
        
        var deferred = $q.defer();
        $localForage.getItem('activities').then(function (data) {
            if (data)
                deferred.resolve(data);
            else
                deferred.reject();
        });
        return deferred.promise;
    }

    var getActivity = function (id) {
        
        var deferred = $q.defer();
        if (!id)
            deferred.reject();

        getAllActivities().then(function (object) {
            if (object) {
                angular.forEach(object, function(identity, key) {
                    if (identity.activityId === id) {
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
        getActivity: getActivity,
        getAllActivities: getAllActivities
    }
}



angular
.module('active')
.factory('activitiesRepo', activity);
