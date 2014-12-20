var gameApp = angular.module('gameApp', []);

gameApp.controller('GameApp',function($scope) {
  $scope.message = "If you can read this then angular is working!";
});

gameApp.controller('gameController',['$scope', function($scope) {
	
	// Initialize
	$scope.classes = {};  // eventually pull this stuff from the sails data model
	$scope.disabled = {};
	$scope.player = 1;
	
	// Tile is clicked
	$scope.clickTile = function(id) {
		
		$scope.disabled[id] = true;
		$scope.classes[id] = 'player'+$scope.player;
		
		// Change player
		if ($scope.player == 1) {
			$scope.player = 2;
		}
		else {
			$scope.player = 1;
		}
	};
	
	$scope.classUpdate = function(id) {
		return $scope.classes[id];
	};
	
	$scope.disableCheck = function(id) {
		if ($scope.disabled[id])
			return true;
		else
			return false;
	}
	
}]);