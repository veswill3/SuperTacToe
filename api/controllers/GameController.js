/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    


  /**
   * `GameController.takeMyTurn()`
   */
  takeMyTurn: function (req, res) {
    var user = req.user;
    var supertile = req.body.supertile;
    var subtile = req.body.subtile;
    
    if (!user)
        return res.forbidden('You are not logged in.');

    Game.findOne()
    .where({ id: req.param('game') })
    // .populate('moves')  //should I use this instead of finding the move below?
    .exec(function (err,game) {

        if (!game)
            return res.badRequest('Invalid game ID of `' + req.param('game') + '`')

        if ((game.playerOne != user.id) && (game.playerTwo != user.id))
            return res.forbidden('You are not playing in this game.');

        //get the last move for this game and make sure the same player is not moving twice in a row
        Move.findOne()
        .where({ game: game.id })
        .sort({createdAt: 'desc'})
        .limit(1)
        .exec(function (err,lastMove) {
            //first move, so only player 1 can move
            if (!lastMove && game.playerOne != user.id)
                return res.forbidden('You dont get first move this game.');
            
            //make sure that this user did not just go
            if (lastMove && lastMove.user == user.id) {
                return res.forbidden('You may not move twice in a row.');

                //for now, for testing, just flip the user to the other user so we can play on the same screen
                if (game.playerOne == user.id) {
                    user = game.playerTwo;
                } else if (game.playerTwo == user.id) {
                    user = game.playerOne;
                }
            }
            console.log('Creating a move record for user ' + user.id + ' to keep track');
            Move.create({game: game, user: user, supertile: supertile, subtile: subtile}).exec(function (err,move) {});
            return res.ok();
        });
    });
  }

};

