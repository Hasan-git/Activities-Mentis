﻿
function Initializer($localForage, $http, $q) {

  

    // Creating Repo
    var initialize = function () {

        var deferred = $q.defer();
        $http.get('Application_data/users.json').success(function (users) {
            $localForage.setItem('users', users).then(function (usersA) {
                if (!usersA)
                    deferred.reject('Initializing failed');
                else {
                    $http.get('Application_data/activities.json').success(function(activities) {
                        $localForage.setItem('activities', activities).then(function (activitiesB) {
                            if (!activitiesB)
                            deferred.reject('Initializing failed');
                        else {
                                $http.get('Application_data/centers.json').success(function (centers) {
                                    $localForage.setItem('centers', centers).then(function (centersC) {
                                        if (!centersC)
                                        deferred.reject('Initializing failed');
                                    else {
                                            $http.get('Application_data/bookedActivities.json').success(function (bookedActivities) {
                                                $localForage.setItem('bookedActivities', bookedActivities).then(function (bookedActivitiesD) {
                                                    if (!bookedActivitiesD)
                                                        deferred.reject('Initializing failed');
                                                    else {
                                                        $http.get('Application_data/notification.json').success(function(notification) {
                                                            $localForage.setItem('notification', notification).then(function (notificationF) {
                                                                if (!notificationF)
                                                                    deferred.reject('Initializing failed');
                                                                else {
                                                                    deferred.resolve('Successfully initialized');
                                                                }
                                                            });
                                                        });
                                                        
                                                    }
                                                });

                                            });
                                    }
                                });
                            });
                        }
                    });
                });
                }
            });
        });
        return deferred.promise;
    }

    // Checking Repo if Exists
    var checkRepo = function () {
        
        var deferred = $q.defer();
        console.log('Checking Repositories...');
        $localForage.getItem('users').then(function (users) {
            if (!users) 
                deferred.reject('Repo not initialized yet 1');
            else {
                $localForage.getItem('activities').then(function(activities) {
                    if (!activities) 
                        deferred.reject('Repo not initialized yet 2');
                    else {
                        $localForage.getItem('centers').then(function (centers) {
                            if (!centers)
                                deferred.reject('Repo not initialized yet 3');
                            else {
                                $localForage.getItem('bookedActivities').then(function (bookedActivities) {
                                    if (!bookedActivities)
                                        deferred.reject('Repo not initialized yet 4');
                                    else {
                                        $localForage.getItem('notification').then(function (notification) {
                                            if (!notification)
                                                deferred.reject('Repo not initialized yet 5');
                                            else {
                                                deferred.resolve('Repo already initialized ');
                                               
                                            }
                                        });
                                        
                                    }
                                });
                            }
                               
                        });
                    }
                });
            }

        });
        return deferred.promise;
    }
    // Destroy Repo 
    var destroyRepo = function () {
        var deferred = $q.defer();
        $localForage.clear().then(function(clear) {
            console.log(clear);
            if (clear)
                deferred.resolve('Repo completely destroyed');
            else {
                deferred.reject('Repo completely destroyed');
            }
        });
        return deferred.promise;
    }


    return {
        initialize: initialize,
        checkRepo: checkRepo,
        destroyRepo: destroyRepo
    }
}



angular
.module('active')
.factory('dataInitializer', ['$localForage', '$http','$q', Initializer]);
