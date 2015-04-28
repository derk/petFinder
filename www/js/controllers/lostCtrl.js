/**
 * Created by federicomaceachen on 3/16/15.
 */
controllerModule.controller('LostCtrl',
  [
    '$scope',
    '$window',
    '$ionicLoading',
    '$ionicModal',
    'LostPetSrv',
    'LocationSrv',
  function($scope,
           $window,
           $ionicLoading,
           $ionicModal,
           LostPetSrv,
           LocationSrv) {

    $scope.radiusValues = [
      { value: '9999', name: 'All' },
      { value: '2', name: '2' },
      { value: '5', name: '5' },
      { value: '10', name: '10' },
      { value: '15', name: '15' },
      { value: '30', name: '30' },
      { value: '50', name: '50' },
      { value: '100', name: '100' }
    ];

    $scope.sortValues = [
      { label: 'Newest', field: 'date', value: 'descending', group: 'Date' },
      { label: 'Oldest', field: 'date', value: 'ascending', group: 'Date' },
      { label: 'A - Z', field: 'name', value: 'ascending', group: 'Name' },
      { label: 'Z - A', field: 'name', value: 'descending', group: 'Name' }
    ];

    $scope.filterValues = [
      { field: 'distance', value: $scope.radiusValues[0], isLocation: false }, //Location MUST be [0]
      { field: 'name', value: '' },
      { field: 'neighborhood', value: '' }
    ];

    $scope.options = {
      page: 0,
      limit: 20,
      count: 0,
      sort: $scope.sortValues[0],
      filter: $scope.filterValues
    };

    $scope.noMoreItemsAvailable = false;

    function noMoreDataCanBeLoaded () {
      return $scope.options.page * $scope.options.limit >= $scope.options.count;
    }

    function fetchLostPets() {
      LostPetSrv.fetch($scope.options).then(
        function success(pets) {
          $scope.lostPets.push.apply($scope.lostPets, pets);
          $scope.options.page++;
          $scope.noMoreItemsAvailable = noMoreDataCanBeLoaded();
          $window.sessionStorage.setItem('lost.pets.collection', JSON.stringify(pets));
          if($scope.modal) {
            $scope.closeModal();
          }
          $ionicLoading.hide();
        },
        function error() {
          $ionicLoading.hide();
        }
      );
    }

    var initialize = function () {
      $ionicLoading.show({
        //templateUrl: '../templates/loading.html'
        template: "<ion-spinner class='spinner-calm' icon='lines'></ion-spinner>"
      });

      LostPetSrv.count().then(
        function success(result) {
          $scope.options.count = result;
          LostPetSrv.fetch($scope.options).then(
            function success(pets) {
              $scope.lostPets = pets;
              $scope.options.page++;
              $scope.noMoreItemsAvailable = noMoreDataCanBeLoaded();
              $window.sessionStorage.setItem('lost.pets.collection', JSON.stringify(pets));
              $ionicLoading.hide();
            },
            function error() {
              $ionicLoading.hide();
            }
          );
        },
        function error(reason) {

        }
      );
    };

    $scope.loadMore = function () {
      fetchLostPets();
    };

    $scope.sortOrFilter = function () {
      $ionicLoading.show({
        //templateUrl: '../templates/loading.html'
        template: "<ion-spinner class='spinner-calm' icon='lines'></ion-spinner>"
      });
      $scope.options.page = 0;
      $scope.noMoreItemsAvailable = false;
      $scope.lostPets = [];
      fetchLostPets();
    };

    $scope.getTitle = function (pet) {
      return pet.get('name') + ' is lost.';
    };

    $scope.getDescription = function (pet) {
      return 'Lost in ' + pet.get('neighborhood') + ', ' + pet.get('locality');
    };

    $scope.getLostDate = function (pet) {
      return pet.get('date');
    };

    $scope.openModal = function() {
      if(!$scope.modal) {
        $ionicModal.fromTemplateUrl('./templates/lost-filter-modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function (modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      } else {
        $scope.modal.show();
      }
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      if($scope.modal)
        $scope.modal.remove();
    });

    $scope.getMyLocation = function () {
      if($scope.filterValues[0].isLocation && !$scope.options.myLocation) {
        $ionicLoading.show({
          //templateUrl: '../templates/loading.html'
          template: "<ion-spinner class='spinner-calm' icon='lines'></ion-spinner>"
        });
        LocationSrv.getMyLocation().then(function (position) {
          $scope.options.myLocation = new Parse.GeoPoint(
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          );
          $ionicLoading.hide();
        });
      }
    };

    initialize();
  }
]);
