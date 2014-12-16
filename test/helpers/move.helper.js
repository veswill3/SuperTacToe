module.exports.create = function(move, cb){
    Move.create(move, function(err, move){
        if(err) console.log(err);
        cb(move);
    });
};