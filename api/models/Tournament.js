/**
* Tournament.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    players: {
        collection: 'user',
        via: 'tournaments'
    },
    matchups: {
        collection: 'game',
        via: 'tournament'
    }
  }
};

