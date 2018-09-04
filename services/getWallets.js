var request = require('request');

module.exports = function(token,req,resp){
        request('http://54.186.160.3:3000/api/wallet?access_token='+token, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                resp.send(body);
            }

        });
}