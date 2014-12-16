module.exports.create = function(game, cb){
    Game.create(game, function(err, game){
        if(err) console.log(err);
        cb(game);
    });
};