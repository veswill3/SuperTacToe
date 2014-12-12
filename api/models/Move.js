/**
* Move.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    game      : { model: 'game', required: true, index: true },
    user      : { model: 'user', required: true, index: true },
    supertile : { type: 'integer', required: true },
    subtile   : { type: 'integer', required: true }
  }
};
