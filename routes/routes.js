var request = require('request');
const JwtGenerator = require('../services/jwtgenerator');
var mongo = require('mongodb').MongoClient;
var url = "mongodb://192.168.99.100:27017/";
var localStorage = require('localStorage');
module.exports = (app) => {
    // Index Page
    app.get('/',function(req,res){        
        var token = localStorage.getItem('access_token');
        var card = localStorage.getItem('card');
        if(token && card){
            res.redirect('/dashboard');
        }
        else{
            res.render('index');
        }
    });    
    // Get All Users
    app.get('/participants', activateCard, (req, res) => {
        let token = localStorage.getItem('access_token');
        let options = {
            method: 'GET',
            url: 'http://54.186.160.3:3000/api/wallet',
            headers: {
                'X-Access-Token': token
            }
        };
        request(options, (error, response, body) => {
            if (error) {
                res.send(error);
            } else {
                res.render('participants',{
                    owners: JSON.parse(body)
                });
            }
        });
    });
    // Add User Page
    app.get('/newuser',(req,res)=>{
        res.render('newuser');
    });
    // Add New User
    app.post('/adduser', (req,res)=>{
        var username = req.body.username;
        var password = req.body.password;
        mongo.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("db");
            var myobj = { username: username, password: password };
            dbo.collection("User").insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
              db.close();
            });
          });        
        res.redirect('/users');
    });
    // Post Request to Get Token
    app.post('/login',(req,res)=>{
        try {
            var JwtToken = JwtGenerator(req.body.username);
            var cardName = req.body.cardname;
            //res.send(JwtToken);
            let options = {
                method: 'GET',
                url: 'http://54.186.160.3:3000/auth/jwt/callback?token=' + JwtToken,
                maxRedirects: '3',
                followRedirect: false
            };
            console.log(JwtToken);
            request(options, function (error, response, body) {
                // upon a successful request, cookies are stored in response.headers['set-cookie']
                var name = "access_token=";
                console.log('Token Request Recieved');
                var access_token = '';
                var ca = decodeURIComponent(response.headers['set-cookie'][0]).split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        access_token = c.substring(name.length, c.length);
                    }
                }
                var matches = access_token.match(/^s:(.+?)\./);                
                localStorage.setItem('access_token',matches[1]);
                localStorage.setItem('card',cardName);
                require('../services/activateWalletCard')(matches[1],true, cardName, req, res);
            });
        } catch (error) {
            console.log(error);
        }
    });

    app.get('/dashboard', activateCard, (req, res) => {
        var token = localStorage.getItem('access_token');
        var card = localStorage.getItem('card');
        res.render('dashboard',{
            token:token,
            card: card
        });
    });
    app.post('/nsftrackingauth', (req, res) => {
        try {
            var JwtToken = JwtGenerator(req.body.username);
            var cardName = req.body.cardname;
            //res.send(JwtToken);
            let options = {
                method: 'GET',
                url: 'http://54.186.160.3:3000/auth/jwt/callback?token=' + JwtToken,
                maxRedirects: '3',
                followRedirect: false
            };

            request(options, function (error, response, body) {
                // upon a successful request, cookies are stored in response.headers['set-cookie']
                var name = "access_token=";
                console.log('Token Request Recieved');
                var access_token = '';
                var ca = decodeURIComponent(response.headers['set-cookie'][0]).split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        access_token = c.substring(name.length, c.length);
                    }
                }                
                var matches = access_token.match(/^s:(.+?)\./);
                /* eventEmitter.emit('token_added');
                res.json({
                    access_token: matches[1],
                    jwttoken: JwtToken
                }); */
                require('../services/activateWalletCard')(matches[1],false,cardName,req,res);

            });
        } catch (error) {
            console.log(error);
        }
    });
    app.get('/historian', activateCard, function (req, res) {
        var token = localStorage.getItem('access_token');
        let options = {
            method: 'GET',
            url: 'http://54.186.160.3:3000/api/system/historian',
             headers: {
                 'X-Access-Token': token
             }
        };
        request(options, (error, response, body) => {
            if (error) {
                res.send(error);
            } else {
                res.render('historian', {
                    historyrecords: JSON.parse(body)
                });
            }
        });
        
    });

    app.post('/addssset',function(req,res){
        var token = localStorage.getItem('access_token');
        let send_data = {
            "$class": "org.nsf.tracking.addAsset",
            "stickerId": req.body.stickerid,
            "productCode": req.body.stickercode,
            "status": "ACTIVE",
            "newOwner": "resource:org.nsf.tracking.Owner#"+req.body.owner
        };
        let options = {
            method: 'POST',
            url: 'http://54.186.160.3:3000/api/org.nsf.tracking.addAsset',
            headers:{
                'X-Access-Token':token
            },
            form:send_data
        };
        request(options,(error,response,body)=>{
            if(error){
                console.error(error);
            }
            else{
                res.redirect('/assets');
            }
        });
    });

    app.get('/assets', activateCard, (req, res) => {
        var token = localStorage.getItem('access_token');
        var card = localStorage.getItem('card');
        if (token && card) {
            let options = {
                method: 'GET',
                url: 'http://54.186.160.3:3000/api/queries/getParticipantAssets?owner=resource%3Aorg.nsf.tracking.Owner%23' + card,
                headers: {
                    'X-Access-Token': token
                }
            };
            request(options, (error, response, body) => {
                if (error) {
                    res.send(error);
                } else {
                    res.render('assets', {
                        assets: JSON.parse(body),
                        card: card
                    });
                }
            });
        }
        else{
            res.redirect('/');
        }
    });

    app.get('/transferasset/:assetid', activateCard, (req, res) => {
        var token = localStorage.getItem('access_token');
        var card = localStorage.getItem('card');
        if(token && card){
            res.render('transferasset',{
                assetId:req.params.assetid
            });
        }
        else{
            res.redirect('/');
        }
    });

    app.post('/transfer',(req,res)=>{
        var token = localStorage.getItem('access_token');
        let send_data = {
            "$class": "org.nsf.tracking.transferAsset",
            "sticker": "resource:org.nsf.tracking.Productsticker#" + req.body.assetId,
            "newOwner": "resource:org.nsf.tracking.Owner#" + req.body.owner
        };
        let options = {
            method: 'POST',
            url: 'http://54.186.160.3:3000/api/org.nsf.tracking.transferAsset',
            headers: {
                'X-Access-Token': token
            },
            form: send_data
        };
        request(options, (error, response, body) => {
            if (error) {
                res.send(error);
            } else {
                res.redirect('/assets');
            }
        });
    });

    app.get('/logout',(req,res)=>{
        localStorage.clear();
        res.redirect('/');
    });
    
}

function activateCard(req,res,next){
    var token = localStorage.getItem('access_token');
    var card = localStorage.getItem('card');
    if(token && card){
        next();
    }
    else{
        res.redirect('/');
    }
}