request = require('supertest');

module.exports.registerAndLogin = function(cb){
    var user, app, agent, pp;

    app = sails.hooks.http.app;
    agent = request.agent(app);

    var password = 'Pa$sw0Rd';
    user = {
        username: 'TestUser' + Date.now(),
        email   : 'TestUser' + Date.now() + '@email.com'
    };

    // create users and log a user in
    async.waterfall([
        function(callback){
            User.create({
                username: user.username,
                email: user.email
            },function(err, u){
                if(err){
                    console.log('An error occured creating a user');
                    console.log(err);
                }
                user = u;

                Passport.create({
                    protocol: 'local',
                    password: password,
                    user: u.id
                }, function(err, p){
                    if(err){
                        console.log('An error occured creating a passport');
                        console.log(err);
                    }
                    pp = p;
                    callback(null);
                });
            });
        },
        function(callback){
            agent.post('/auth/local')
            .send({
                identifier: user.email,
                password: password
            })
            .end(function(err, res){
                if(err){
                    console.log('An error occurred logging the user in. err=' + err);
                    console.log(err);
                }

                if(res.status !== 200){
                    console.log('An error occured logging the user in. res.status=' + res.status);
                    console.log(res);
                }
                callback(null);
            });
        }], function(err){
            if(err){
                console.log('An error occured in user.helper');
                console.log(err);
            }

            console.log('you should see this');
            cb(user, agent);
        });
};

module.exports.logout = function(agent, cb){
    agent.get('/logout').end(cb);
};