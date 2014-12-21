var userHelper = require('../../helpers/user.helper.js');
var gameHelper = require('../../helpers/game.helper.js');
var moveHelper = require('../../helpers/move.helper.js');
var Sails = require('sails');
var user1, agent1, user2, agent2, user3, agent3, gameU1andU2;

before(function(done) {
    this.timeout(10000); //sails takes longer to lift
    Sails.lift({
    // configuration for testing purposes
    log: { level: 'error' },  // 'silly'
    hooks: { grunt: false, },
    }, function(err, sails) {
    if (err) return done(err);
    // here you can load fixtures, etc.
    userHelper.registerAndLogin(function (u, a) {
        user1 = u;
        agent1 = a;
        userHelper.registerAndLogin(function (u, a) {
            user2 = u;
            agent2 = a;
            userHelper.registerAndLogin(function (u, a) {
                user3 = u;
                agent3 = a;
                gameHelper.create({playerOne: user1, playerTwo: user2}, function(game) {
                    gameU1andU2 = game;
                    done(err, sails);
                });
            });
        });
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
            agent1.post('/game/9876/takemyturn') //not a valid game record
            .send({supertile: 1, subtile: 1})
            .expect(400, 'Invalid game ID of `9876`', done);
        });

        describe('the player', function () {

            it ('should be logged in', function (done) {
                userHelper.registerAndLogin(function (u, a) {
                    userHelper.logout(a, function () {
                        a.post('/game/' + gameU1andU2.id + '/takemyturn')
                        .send({supertile: 1, subtile: 1})
                        .expect(403, 'You are not logged in.', done);
                    });
                });
            });

            it ('should be a player in the game', function (done) {
                agent3.post('/game/' + gameU1andU2.id + '/takemyturn')
                .send({supertile: 1, subtile: 1})
                .expect(403, 'You are not playing in this game.', done);
            });

            it ('should only get first move if they are player 1', function (done) {
                agent2.post('/game/' + gameU1andU2.id + '/takemyturn')
                .send({supertile: 1, subtile: 1})
                .expect(403, 'You dont get first move this game.', done);
            });

            it ('should not be able to move twice in a row', function (done) {
                this.timeout(10000);
                var aNewGame = {playerOne: user1, playerTwo: user2};
                gameHelper.create(aNewGame, function (game) {
                    var newMove = {game: game, user: user1, supertile: 1, subtile: 1};
                    moveHelper.create(newMove, function (move) {
                        agent1.post('/game/' + game.id + '/takemyturn')
                        .send({supertile: 1, subtile: 2})
                        .expect(403, 'You may not move twice in a row.', done);
                    });
                });
            });

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