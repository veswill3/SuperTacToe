(function () {
    'use strict';
 
    angular.module('superTacToe')
    .controller('GameListController', ['$scope', '$rootScope', function ($scope, $rootScope) {

        this.changeGame = function(gameId) {
            $rootScope.currentGame = gameId;
        };

    	// fake data for now
    	var gameList = [{
    		name: "You vs Carl",
            gameId: 1
    	}, {
    		name: "You vs Laura",
            gameId: 2
    	}, {
    		name: "You vs Lehar",
            gameId: 3
    	}, {
    		name: "You vs Saikat",
            gameId: 4
    	}, {
    		name: "You vs Derek",
            gameId: 5
    	}];

    	this.games = gameList;

    }]);
 
}());