/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
	username: {
	 type: 'STRING',
	 required: true,
	 unique: true
	},
	password: {
	 type: 'STRING',
	 minLength: 4,
	 unique: true
	},
	email: {
	 type: 'email',
	 required: true,
	 unique: true
	}
  }
};

