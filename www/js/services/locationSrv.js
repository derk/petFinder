/**
 * Created by federicomaceachen on 4/27/15.
 */
services.factory('LocationSrv',
  [
    '$q',
    '$cordovaGeolocation',
  function(
    $q,
    $cordovaGeolocation){

    function getMyLocation() {
      var posOptions = { timeout: 10000, enableHighAccuracy: false };
      return $cordovaGeolocation.getCurrentPosition(posOptions);
    }

    return {
      getMyLocation: getMyLocation
    }

  }
]);