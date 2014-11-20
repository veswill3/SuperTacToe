


var playRandomGame = function() {
		if (winner != 0)
			return;

		var list = $('.SmallTile:enabled').get();
		
		var item = winningMove(list) // Check for winning move
		
		if (!item) { // Else pick random
			var item = list[Math.floor(Math.random()*list.length)];
		}
		
		
		if (list.length < 1) {
			return;
		}
				
		setTimeout( function () {
			item.click();
			playRandomGame();
		},10);
		
	}
	
var winningMove = function(list) {

	for (var i = 0; i < list.length; i++) {
		// get elements from big board
		
		// add list[i]
		
		// run evaluateGame function from gameLogic
		
		// if winning move found, return it
	}

	// if not, return blank
	return "";
	
}