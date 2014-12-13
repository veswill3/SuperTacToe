var AboutController = require('../../api/controllers/GameController'),
    sinon = require('sinon'),
    assert = require('assert'),
    request = require('supertest'),
    Sails = require('sails');

before(function(done) {
  this.timeout(10000); //sails takes longer to lift
  Sails.lift({
    // configuration for testing purposes
    log: { level: 'error' },  // 'silly'
    hooks: { grunt: false, },
  }, function(err, sails) {
    if (err) return done(err);
    // here you can load fixtures, etc.
    done(err, sails);
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});

describe('The Game Controller', function () {

    describe('when posting to takemyturn', function () {

        it ('should return an error when posting to an invalid game', function (done) {
            // currently failes, need to login first
            request(sails.hooks.http.app)
              .post('/game/9876/takemyturn') //not a valid game record
              .send({elementID: '0000'})
              .expect(400, 'Invalid game ID of `8976`', done);
        });

        describe('the player', function () {
            it ('should be logged in', function (done) {
                request(sails.hooks.http.app)
                  .post('/game/1/takemyturn')
                  .send({elementID: '0000'})
                  .expect(403, 'You are not logged in.', done);
            });
            it ('should be a player in the game');
            it ('should only get first move if they are player 1');
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
        })

    })

})