
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
    }//End Get Activity

    var centerActivity = function (center) {

        var def = $q.defer();
        var array = [];
        $localForage.getItem('activities').then(function (data) {

            angular.forEach(data, function (value, key) {
                if (value.centerName === center) {
                    array.push(value);
                    
                }
                def.resolve(array);
            });
            
        });
        $q.all([array]).then(function (da) { def.resolve(da); });
        return def.promise;
    }
    var centerActivitiesById = function (id) {

        var def = $q.defer();
        var array = [];
        var obj = {};
        $localForage.getItem('activities').then(function (data) {

            angular.forEach(data, function (value, key) {
                if (value.centerId === id) {
                    array.push(value);

                }
               
            });
            obj = array;
        });
        $q.all([array]).then(function (da) { def.resolve(da[0]); });
        return def.promise;
    }


    var getAllCentersActivities = function () {
        var centers = [];
        var result = {};
        var deferred = $q.defer();
        $localForage.getItem('activities').then(function (data) {
            
            angular.forEach(data, function (value, key) {
                if (centers.indexOf(value.centerName) === -1) {
                    centers.push(value.centerName);
                    var indexName = value.centerName;
                    $localForage.getItem('activities').then(function (response) {
                        var array = [];
                        angular.forEach(response, function (v, k) {
                            if (v.centerName === value.centerName) {
                                array.push(v);
                            }//end if 
                        });//end for
                        result[indexName] = array;
                        $q.all([array, result]).then(function (da) { });
                    });//end all activities of this center
                }//end if
                $q.all([result]).then(function (da) {deferred.resolve(da);});
            });//foreach
        });

        return deferred.promise;
    }// end centers activities



    return {
        getActivity: getActivity,
        getAllActivities: getAllActivities,
        getAllCentersActivities: getAllCentersActivities,
        centerActivity: centerActivity,
        centerActivitiesById: centerActivitiesById
}
}



angular
.module('active')
.factory('activitiesRepo', activity);
