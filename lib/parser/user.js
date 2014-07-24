var _ = require('underscore');

module.exports = (function(){

    var user = function(){

        this.item = {};

        this.setUser = function(user){
            this.item = user;
        };

        this.getUsername = function(nickname, friends){
            var username = false;

            _.each(friends, function(f){
                if (f.nickname === nickname){
                    username = f.username;
                }
            });
            return username;
        };

    };


    return user;
}());