


var playRandomGame = function() {
		if (winner != 0)
			return "";

		var list = $('.SmallTile:enabled').get();
		var item = list[Math.floor(Math.random()*list.length)];
		
		
		if (list.length < 1) {
			return "";
		}
				
		setTimeout( function () {
			item.click();
			playRandomGame();
		},10);
		
	}