var userHelper = require('../../helpers/user.helper.js');
var gameHelper = require('../../helpers/game.helper.js');
var moveHelper = require('../../helpers/move.helper.js');
var Sails = require('sails');
var user, agent;

before(function(done) {
  this.timeout(10000); //sails takes longer to lift
  Sails.lift({
    // configuration for testing purposes
    log: { level: 'error' },  // 'silly'
    hooks: { grunt: false, },
  }, function(err, sails) {
    if (err) return done(err);
    // here you can load fixtures, etc.
    app = sails.hooks.http.app;
    userHelper.registerAndLogin(function (u, a) {
        user = u;
        agent = a;
        done(err, sails);
    });
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});

describe('The Game Controller', function () {

    describe('when posting to takemyturn', function () {

        it ('should return an error when posting to an invalid game', function (done) {
            agent.post('/game/9876/takemyturn') //not a valid game record
            .send({supertile: 1, subtile: 1})
            .expect(400, 'Invalid game ID of `9876`', done);
        });

        describe('the player', function () {

            it ('should be logged in', function (done) {
                userHelper.registerAndLogin(function (u, a) {
                    userHelper.logout(a, function () {
                        a.post('/game/1/takemyturn')
                        .send({supertile: 1, subtile: 1})
                        .expect(403, 'You are not logged in.', done);
                    });
                });
            });

            it ('should be a player in the game', function (done) {
                userHelper.generate(function (user1) {
                    userHelper.generate(function (user2) {
                        var game = {players: [user1, user2]};
                        gameHelper.create(game, function (game) {
                            // This agent is neither user1 nor user 2
                            agent.post('/game/' + game.id + '/takemyturn')
                            .send({supertile: 1, subtile: 1})
                            .expect(403, 'You are not playing in this game.', done);
                        });
                    });
                });
            });

            it ('should only get first move if they are player 1'/*, function (done) {
                // This does not currently work becasue I just found out that
                // game.players collection cannot be an ordered list. Even though
                // I put playerOne in first, it is reordered when returned from
                // the DB and the controller does not know the difference
                this.timeout(10000);
                userHelper.generate(function (playerOne) {
                    var game = {players: [playerOne, user]};
                    gameHelper.create(game, function (game) {
                        agent.post('/game/' + game.id + '/takemyturn')
                        .send({supertile: 1, subtile: 1})
                        .expect(403, 'You are not playing in this game.', done);
                    });
                });
            }*/);

            it ('should not be able to move twice in a row');

        })

        describe('the chosen tile', function () {
            it ('should be a valid tile on the board');
            it ('should be a tile that is not already taken');
            it ('should be in the supertile of the prev moves subtile when it is not full/won');
            it ('can go to any empty tile when sent to a supertile that is full or won');
        })

        describe ('the new game state', function () {
            it ('should indicate player as winner of supertile if they won the subgame');
            it ('should indicate player as winner if winning 3 supertiles in tictactoe fashion');
            it ('should include a new move record');
        })

    })

})