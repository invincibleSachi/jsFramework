var Util = function(){

this.getRandomNum = function(min, max){
    return parseInt(Math.random() * (max - min) + min);
};

};
module.exports = Util;