
function notificationsRepo($localForage, $q, activitiesRepo) {

    var getMax = function (array) {
        var result = 2;
        var deferred = $q.defer();
        if (array.length === 1) {
            result = array[0].notificationId + 1;
            deferred.resolve(result);
        } else {
            angular.forEach(array, function (value, key) {
                if (value.notificationId >= result) {
                    result = value.notificationId + 1;
                }
            });
            $q.all([result]).then(function (da) { deferred.resolve(da); });
        }
        return deferred.promise;
    }
    //checking if user already saved the current activity
    var validateNotification = function (userId, activityId, object) {

        var deferred = $q.defer();
        var result;

        
        angular.forEach(object[0], function (value, key) {
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
    } //End validate notification

    var getAllNotifications = function () {
        var notifications = [];
        var deferred = $q.defer();
        $localForage.getItem('notification').then(function (data) {
            if (data)
                deferred.resolve(data);
            else
                deferred.reject();
        });
        return deferred.promise;
    }

    var getNotificationsByUserId = function (userId) {

        var deferred = $q.defer();
        if (!userId)
            deferred.reject();

        getAllNotifications().then(function (object) {
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

    var setNewNotification = function (activityId, userId) {

        var deferred = $q.defer();
        if (activityId && userId) {
            activitiesRepo.getActivity(activityId).then(function (activityDetails) {
                getNotificationsByUserId(userId).then(function (response) {
                    validateNotification(userId, activityId, response).then(function (valid) {

                        if (valid === "grant") {
                            getMax(response[0]).then(function (max) {
                                getAllNotifications().then(function (all) {
                                    var discription = "Your saved event " + activityDetails.title +
                                    " will start in " + activityDetails.startDate;
                                    var notification = {
                                        "notificationId": max[0],
                                        "userId": userId,
                                        "activityId": activityId,
                                        "discritpion": discription,
                                        "reservationDate": new Date()
                                    }
                                    var a = [];
                                    a = all;
                                    a.push(notification);
                                    $localForage.setItem('notification', a).then(function (dat) {

                                        deferred.resolve("Activity saved !");
                                    });

                                });
                            });
                        } //if validation
                        else {
                            deferred.reject("Already saved");
                        }

                    }, function (err) { deferred.reject("Already saved"); });
                });
            });
        }
        return deferred.promise;
    }

    return {
        getNotificationsByUserId: getNotificationsByUserId,
        getAllNotifications: getAllNotifications,
        setNewNotification: setNewNotification
    }
}



angular
.module('active')
.factory('notificationsRepo', notificationsRepo);
