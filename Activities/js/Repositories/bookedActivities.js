
function bookedActivitiesRepo($localForage, $q, activitiesRepo) {

    var getMax = function (array) {
        var result = 2;
        var deferred = $q.defer();
        if (array.length === 1) {
            result = array[0].purchaseId + 1;
            deferred.resolve(result);
        } else {
            angular.forEach(array, function (value, key) {
                if (value.purchaseId >= result) {
                   result = value.purchaseId + 1;
               }
            });
            $q.all([result]).then(function (da) { deferred.resolve(da); });
        }
        return deferred.promise;
    }
    //checking if user already purchased the current activity
    var validateBooking = function (userId, activityId, bookedActivityObject) {

        var deferred = $q.defer();
        var result;
        
        
        angular.forEach(bookedActivityObject[0], function (value, key) {
            if (userId === value.userId && activityId === value.activityId) {
                result = "reject";
                deferred.reject("reject");
            } 
        });
        $q.all([result]).then(function (da) {
           
            if (da === "reject") {
                deferred.resolve("reject");
            } else {
                deferred.resolve("grant");
            }
            
            
        });
        return deferred.promise;
    } //End validateBooking

    var getAllBookedActivities = function () {
        var users = [];
        var deferred = $q.defer();
        $localForage.getItem('bookedActivities').then(function (data) {
            if (data)
                deferred.resolve(data);
            else
                deferred.reject();
        });
        return deferred.promise;
    }

    var getBookedActivitiesByUserId = function (userId) {

        var deferred = $q.defer();
        if (!userId)
            deferred.reject();

        getAllBookedActivities().then(function (object) {
            var result = [];
            if (object) {
                angular.forEach(object, function (value, key) {
                    if (value.userId === userId) {
                        result.push(value);
                    }
                });
                $q.all([result]).then(function (da) { deferred.resolve(da); });
            } else {
                deferred.reject();
            }
        });
        return deferred.promise;
    }
    var setNewBookedActivity = function (activityId, userId) {
        
        var deferred = $q.defer();
        if (activityId && userId) {
            activitiesRepo.getActivity(activityId).then(function(activityDetails) {
                getBookedActivitiesByUserId(userId).then(function (response) {
                    validateBooking(userId, activityId, response).then(function (valid) {
                        
                        if (valid === "grant") {
                            getMax(response[0]).then(function(max) {
                                getAllBookedActivities().then(function(all) {
                                    var newBooked = {
                                        "purchaseId": max[0],
                                        "userId": userId,
                                        "activityId": activityId,
                                        "activityTitle": activityDetails.title,
                                        "activityTime": activityDetails.time,
                                        "activityAttendStatus": activityDetails.attendStatus,
                                        "activityattendDays": activityDetails.attendDays,
                                        "reservationDate": new Date()
                                    }
                                    var a = [];
                                    a = all;
                                    a.push(newBooked);
                                    $localForage.setItem('bookedActivities', a).then(function (dat) {
                                        
                                        deferred.resolve("Activity is Booked successfully");
                                    });

                                });
                            });
                        } //if validation
                        else {
                            deferred.reject("Already Purchased");
                        }
                      
                    }, function (err) { deferred.reject("Already Purchased"); });
                });
            });
        }
        return deferred.promise;
    }

    return {
        getBookedActivitiesByUserId: getBookedActivitiesByUserId,
        getAllBookedActivities: getAllBookedActivities,
        setNewBookedActivity: setNewBookedActivity
    }
}



angular
.module('active')
.factory('bookedActivitiesRepo', bookedActivitiesRepo);
