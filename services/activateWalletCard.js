var request = require('request');
const event = require('events');

var eventEmitter = new event.EventEmitter();

eventEmitter.on('completed', () => {
    console.log('Token Created and Card Activated');
});

module.exports = (token,redirect, cardName, req, res) => {
    let options = {
        method: 'POST',
        url: 'http://54.186.160.3:3000/api/wallet/' + cardName + '/setDefault',
        headers: {
            'X-Access-Token': token
        }
    };
    request(options, (error, response, body) => {
        status = body!=""?JSON.parse(body):null;
        if (status && status.error.statusCode == "404") {
            res.send(status.error.message);
        }
        else{
            if (redirect == false) {
               eventEmitter.emit('completed');
               res.json({
                   access_token: token,
                   status: 'success'
               });
            }
            else {
                res.redirect('/dashboard');
            }

        }
    });

}