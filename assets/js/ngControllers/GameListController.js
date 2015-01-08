(function () {
    'use strict';
 
    angular.module('superTacToe')
    .controller('GameListController', ['$scope', function ($scope) {

    	// fake data for now
    	var gameList = [{
    		name: "You vs Carl"
    	}, {
    		name: "You vs Laura"
    	}, {
    		name: "You vs Lehar"
    	}, {
    		name: "You vs Saikat"
    	}, {
    		name: "You vs Derek"
    	}];

    	this.games = gameList;

    }]);
 
}());