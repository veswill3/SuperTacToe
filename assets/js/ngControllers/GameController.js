(function () {
	// 'use strict';

angular.module('superTacToe')
.controller('GameController',['$scope', function($scope) {

	// game model:
	// 	winner
	// 	currentPlayer
	// 	superTile[]
	// 		ownedBy
	// 		subTile[]
	// 			enabled
	// 			ownedBy

	this.winner = '';
	this.tournament = 'Tournament of destruction';
	this.currentPlayer = 1;
	this.playerOne = "Carl";
	this.playerTwo = "Vesper";
	this.superTile = [];

	var superTileAry = [];
	var bigTile = {};
	var subTileAry = [];
	var subTile = {};
	// initialize the 9 supertiles
	for (var i = 0; i < 9; i++) {
		bigTile = {
			ownedBy: '',
			subTile: []
		};
		// initialize the 9 subtiles
		subTileAry = [];
		for (var j = 0; j < 9; j++) {
			subTile = {
				enabled: true,
				ownedBy: ''
			};
			subTileAry.push(subTile);
		};
		bigTile.subTile = subTileAry;
		superTileAry.push(bigTile);
	};

	this.superTile = superTileAry;

	/// vespers changes above ///	
	
	// Initialize
	$scope.classes = {};  // eventually pull this stuff from the sails data model
	$scope.disabled = {};
	$scope.tileMarker = {};
	$scope.bigTile = {};
	
	// Tile is clicked
	this.clickTile = function(id) {
		
		$scope.disabled[id] = true;
		var player = this.currentPlayer;
		$scope.classes[id] = 'player'+player;
		
		// Change player and update tile to X or O
		if (player == 1) {
			player = 2;
			$scope.tileMarker[id] = 'X';
		}
		else {
			player = 1;
			$scope.tileMarker[id] = 'O';
		}
		this.currentPlayer = player;
		
		// Evaluate sub-game to see if it's full or won
		var bigTileId = id.slice(0,2);
		if (!$scope.bigTile[bigTileId]) {
			
			// Get all elements from current sub-game
			var elements = elementsFromGame(bigTileId);
			
			
			// Translate into values
			elements = elements.map(function(e) {
				return $scope.tileMarker[e];
			});
        // Evaluate Game
        result = evalGame(elements);
		}
		
		// If someone won
		if (result) {
			// Mark Big Tile with winner
			$scope.bigTile[bigTileId] = result;
			
			// disable all buttons in the big tile
			// and remove other players winning marks
			var elements = elementsFromGame(bigTileId);
			elements.forEach(function(e) {
				$scope.disabled[e] = true;
				$scope.classes[e] = 'player'+player;
			});
			
			// If necessary, evaluate overall board (hard-coded for now)
			bigResult = evalGame([$scope.bigTile['00'],$scope.bigTile['01'],$scope.bigTile['02'],
								$scope.bigTile['10'],$scope.bigTile['11'],$scope.bigTile['12'],
								$scope.bigTile['20'],$scope.bigTile['21'],$scope.bigTile['22']]);
								
			if (bigResult) {
				winner = player;
				alert('Player ' + bigResult + ' wins!');
			}
		}
		
		// Update the rest of the board for the opponents turn
		// disable the entire board
		switchEnabled(true,$scope);
		
		
		
		// Determine new sub-game
		var nextGame = id.slice(2,4);
		// Did player send their opponent to an already won board?
		if ($scope.bigTile[nextGame]) {
		// If yes, enable all
			switchEnabled(false,$scope);
		}
		  
		//  Else - was board already full?
		var count = 0;
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				if ($scope.tileMarker[""+nextGame+i+j]) {
					count += 1;
				}
		}}
		if (count === 9) {
			// If yes, enable all
			switchEnabled(false,$scope);
		}
		  
		//  Else, just enable new sub-game's board
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				if (!$scope.tileMarker[""+nextGame+i+j]) {
					$scope.disabled[""+nextGame+i+j] = false;
				}
		}}
	};
	
	// Holds classes for each tile to do coloring.
	this.classUpdate = function(id) {
		return $scope.classes[id];
	};
	
	// Holds disabled status of each tile
	this.disableCheck = function(id) {
		if ($scope.disabled[id])
			return true;
		else
			return false;
	}
	
}]);

// elements from game as an arry
var elementsFromGame = function(element) {
    var base = "";
    if (element)
        base = element.slice(0,2);
    var elements = []
    for (var i =0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            elements.push(base+i+j);
        }
    }
    return elements;
}

function evalGame(game){
    // Possible Winning games
    var games = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
    
    for (var i = 0; i < games.length; i++) {
        if (compareThree(game[games[i][0]-1], game[games[i][1]-1], game[games[i][2]-1])) 
            return game[games[i][0]-1];
    }
}

var compareThree = function(one,two,three) {
    if (!one || !two || !three)
        return "";
    return one == two && two == three;
};

var switchEnabled = function(status,$scope) {
	for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				if (!$scope.bigTile[""+i+j]) {
				for (var k = 0; k < 3; k++) {
					for (var l = 0; l < 3; l++) {
					 if (!$scope.tileMarker[""+i+j+k+l])
						$scope.disabled[""+i+j+k+l] = status;
				}
		}}}}
}

}());