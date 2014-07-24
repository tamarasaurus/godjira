module.exports = (function(){

    var project = function(){

        this.item = {};

        this.set = function(p){
            this.item = p;
            return p;
        };

        this.getKey = function(){
            return this.item.key;
        };

        this.getName = function(){
            return this.item.name;
        };

        this.getLead = function(){

        };

        this.getVersions = function(){
            return this.item.versions;
        };

    };


    return project;
}());