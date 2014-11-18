var player = 1

$(document).ready(function() {

	// tile clicked
	$('.bTile').click(cellClick);
	
	// reset clicked
	$('#resetBoard').click(resetClick);
	
	
});

var resetClick = function() {
    player = 1; // reset the player
    $('.bTile').removeAttr('disabled'); // un-disable the buttons
    $('.bTile').text(''); // remove the text
}


var cellClick = function() {
    
    // Get current element id
    var element = this.id;
    
    // disable the button
    $('#'+element).attr('disabled',1);
    
    // Change the underscore to a X or O
    if (player == 1)
        $('#'+element).html('X');
    else
        $('#'+element).html('O');
    
    
    // Get all elements from current sub-game
    var elements = elementsFromGame(element);
    
    // Translate into values
    elements = elements.map(function(e) {
        return $('#'+e).text();
    })

    // Evaluate Game
    var result = evalGame(elements);
    
    // If someone won
    if (result) {
        //
        alert('player' + player + ' won small game. bigTilePrefix: ' + element.slice(0,2));
        // retain this info by adding a class indicating who won the small game (AKA big tile)
        var bigTilePrefix = element.slice(0,2);
        $('#' + bigTilePrefix).addClass('Won');
        $('#' + bigTilePrefix).addClass('WonByPlayer' + player);

        for (var k = 0; k < 3; k++) {
            for (var l = 0; l < 3; l++) {
                $('#' + bigTilePrefix + k + l).attr('disabled',1);
            };
        };
        
        // change appropriate bigTile td to reflect win
        // TODO: Determine how big board will show winner
        //$('.'+element.slice(0,2)).
        
        // If necessary, evaluate overall board
	var bigBoard = elementsFromGame("");
	
	
        // If necessary, remove tiles and replace with bigger tile
    }
    
    // Determine new sub-game
    
    // If necessary (not a completed board) deactivate tiles
    
    // Re-activate new tiles (all or just new sub-game)
    
    // Switch player
    if (player == 1)
        player = 2;
    else
        player = 1;

    
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
