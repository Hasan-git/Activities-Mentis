
function centersRepo($localForage, $q, activitiesRepo) {

    var  validateLocation = function ()
    {
        var deferred = $q.defer();
        var defaultLocation = {
            latitude: 51.525045,
            longitude: -0.127938
        };
        var geocoder = new google.maps.Geocoder;
        //current Position
        navigator.geolocation.getCurrentPosition(function (pos) {
            
            var lat = pos.coords.latitude;
            var lng = pos.coords.longitude;
            var latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };
            geocoder.geocode({ 'location': latlng }, function (results, status) {

                if (status === google.maps.GeocoderStatus.OK) {
                    var length = results.length - 1;
                    if (results) {
                        var country = results[length].formatted_address;
                        if (country === "United Kingdom") {
                            defaultLocation.latitude = lat;
                            defaultLocation.longitude = lng;
                            deferred.resolve(defaultLocation);
                        } else {
                            deferred.resolve(defaultLocation);
                        }
                    }
                }
            });
        });
        $q.all([defaultLocation]).then(function (da) { deferred.resolve(defaultLocation); });
        return deferred.promise;
    }
   

    var rad = function (x) {
        return x * Math.PI / 180;
    };

    var getDistance = function (p1, p2) {
        var deferred = $q.defer();
        var d;
        var r = 6378137; // Earth’s mean radius in meter
        var dLat = rad(p2.latitude - p1.latitude);
        var dLong = rad(p2.longitude - p1.longitude);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) *
          Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        d = parseInt(r * c)/1000;
        //return d / 1000; // returns the distance in Kilometer
        $q.all([d]).then(function (da) { deferred.resolve(da); });
        return deferred.promise;
    };

    var getAllCenters = function () {
        var centers = [];
        var deferred = $q.defer();
        $localForage.getItem('centers').then(function (data) {
            if (data)
                deferred.resolve(data);
            else
                deferred.reject();
        });
        return deferred.promise;
    }

    var getCenter = function (id) {

        var deferred = $q.defer();
        if (!id)
            deferred.reject();

        getAllCenters().then(function (object) {
            if (object) {
                angular.forEach(object, function (identity, key) {
                    if (identity.centerId === id) {
                        deferred.resolve(identity);
                    }
                });
            } else {
                deferred.reject();
            }
        });
        return deferred.promise;
    }
    var getCentersInjActivities = function () {
        
        var deferred = $q.defer();
        var centersArray = [];
        validateLocation().then(function (userLocation) {
            getAllCenters().then(function (centers) {
                
                angular.forEach(centers, function (center, key) {
                    var central = {};
                    central = center;
                    getDistance(center.latLng, userLocation).then(function (distance) {
                        central["distance"] = distance[0];
                            activitiesRepo.centerActivitiesById(center.centerId).then(function (da) {
                                central["activities"] = da;
                                
                            });// push activities to center object
                            centersArray.push(central);
                            
                        $q.all([centersArray]).then(function (da) { deferred.resolve(da[0]); });
                        });// get distance btwn user and center
                    });// go in each center
                });// get all centers
            });// get user location

        return deferred.promise;
    }

    var getCenterWithActivities = function (id) {

        var deferred = $q.defer();
        var centersArray = [];
            getCenter(id).then(function (centers) {
                
                    var central = {};
                    central = centers;
                    
                    deferred.resolve(centers);
                    activitiesRepo.centerActivitiesById(centers.centerId).then(function (da) {
                            central["activities"] = da;
                           
                        });// push activities to center object
                        centersArray.push(central);

                        $q.all([centersArray]).then(function (da) { deferred.resolve(da[0]); });
                 
               
            });// get  center
       

        return deferred.promise;
    }

    return {
        getAllCenters: getAllCenters,
        getCenter: getCenter,
        getCentersInjActivities: getCentersInjActivities,
        getCenterWithActivities: getCenterWithActivities
    }


}



angular
.module('active')
.factory('centersRepo', centersRepo);
