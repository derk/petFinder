/**
 * Created by federicomaceachen on 4/16/15.
 */
services.factory('MapSrv', [
  function(){

    var initializeMap = function (mapElement, mapOptions) {
      return new google.maps.Map(mapElement, mapOptions);
    };

    return {
      initializeMap: initializeMap
    }

  }
]);