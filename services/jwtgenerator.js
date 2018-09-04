var uuid = require('uuid');
var nJwt = require('njwt');
module.exports = function(username){
    var claims = {
        "username":username,
        "timestamp": Date.now()
    };
    var secret = "gSi4WmttWuvy2ewoTGooigPwSDoxwZOy";
    var jwt = nJwt.create(claims, secret, "HS256");
    var token = jwt.compact();
    return token;
}