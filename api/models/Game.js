/**
* Game.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    playerOne  : { model: 'user' },
    playerTwo  : { model: 'user' },
    tournament : { model: 'tournament' },
    moves: {
        collection: 'move',
        via: 'game'
    }
  }
};
