/**
* Game.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    tournament : { model: 'tournament' },
    playerOne  : { model: 'user', required: true },
    playerTwo  : { model: 'user', required: true },
    moves      : { collection: 'move', via: 'game' }
  }
};
