


var playRandomGame = function() {
		
		var list = $('.bTile:enabled').get();
		var item = list[Math.floor(Math.random()*list.length)];
		
		
		if (list.length < 1) {
			return "";
		}
				
		setTimeout( function () {
			item.click();
			playRandomGame();
		},10);
		
	}