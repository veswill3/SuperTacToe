var player = 1

$(document).ready(function() {
	// tile clicked
	$('.SmallTile').click(cellClick);
	// reset clicked
	$('#resetBoard').click(resetClick);

    $('#playRandom').click(function() {
        resetClick();
        playRandomGame();
    });
});

var resetClick = function() {
    player = 1; // reset the player
    $('#player').text(player);
    $('.SmallTile').removeAttr('disabled').text(''); // un-disable the buttons, remove text
    // clear who won what
    $('.Won').removeClass('Won');
    $('.WonByPlayer1').removeClass('WonByPlayer1');
    $('.WonByPlayer2').removeClass('WonByPlayer2');
}

var cellClick = function() {
    
    // Get current element id
    var elementId = this.id;
    
    // disable the button
    $('#'+elementId).attr('disabled',1);
    
    // Change the underscore to a X or O
    $('#' + elementId).html(player === 1 ? 'X' : 'O').addClass('WonByPlayer' + player);
    
    // Get all elements from current sub-game
    var elements = elementsFromGame(elementId);
    
    // Translate into values
    elements = elements.map(function(e) {
        return $('#'+e).text();
    })

    // Evaluate Game
    var result = evalGame(elements);
    
	var bigTileId = elementId.slice(0,2);
	
    // If someone won
    if (result) {
		// Mark Big Tile with winner
        $('#' + bigTileId).addClass('Won');
        $('#' + bigTileId).addClass('WonByPlayer' + player);
        // disable all buttons in the big tile
        $('#' + bigTileId + ' button').attr('disabled',1);
        // remove other players winning marks
        $('#' + bigTileId + ' button').removeClass('WonByPlayer' + (player === 1 ? 2 : 1));
        // mark all tiles in this big tile as belonging to the current player
        $('#' + bigTileId + ' button').addClass('WonByPlayer' + player);
        
        // If necessary, evaluate overall board
		var bigBoard = elementsFromGame("").map(function(data) {
			if ($('#' + data).hasClass('Won')) {
					if ($('#' + data).hasClass('WonByPlayer1'))
						return 1;
					else {return 2;}
				}
			return "";
			});
			
		var bigResult = evalGame(bigBoard);
		if (bigResult) {
			console.log('Big Result');
			console.log(bigResult);
		}
	}
    
    // Determine new sub-game
    var nextGame = elementId.slice(2,4);
	
	if ($('#' + nextGame).hasClass('Won')) { // enable all remaining boards
	
	}
	else {  //just enable this board
	
	}
	
    // If necessary (not a completed board) deactivate tiles
    
    // Re-activate new tiles (all or just new sub-game)
    
    // Switch player
    if (player == 1)
        player = 2;
    else
        player = 1;

    $('#player').text(player);
}

// Given one element (the id of the HTML elmeent), return rest of
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

var enableBoard = function(board) {
	var list = jQuery.each($('#' + board + ' button'),function(i,val) {
		if (!$('#'+val.id).html())
			$('#'+val.id).removeAttr('disabled');
	});
}
	
