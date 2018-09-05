var request = require('request');
var pool = require('../db/db-config');

const JwtGenerator = require('../services/jwtgenerator');
var mongo = require('mongodb').MongoClient;
var url = "mongodb://192.168.99.100:27017/";
var localStorage = require('localStorage');
module.exports = (app) => {
    // Index Page
    app.get('/',function(req,res){        
        
            res.redirect('/dashboard');        
    });    
    // Get All Users
    app.get('/participants', activateCard, (req, res) => {
        
    });
    // Add User Page
    app.get('/newuser',(req,res)=>{
        res.render('newuser');
    });
    // Add New User
    app.post('/adduser', (req,res)=>{
        
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

    app.get('/dashboard',(req, res) => {        
        res.render('dashboard');
    });   

    app.post('/newcab',(req,res)=>{
        res.render('newcab');
    });

    app.post('/addcab',(req,res)=>{
        pool.query('INSERT INTO cab_details_master SET ?',req.body, (error,result)=>{
            if(error){res.send(error);}
            else{
                res.redirect('/allcabs');
            }
        });
    });
    
    app.all('/allcabs',function(req,res){
        pool.query('SELECT * FROM cab_details_master', (error,result)=>{
            if(error){res.send(error);}
            else{
                res.render('allcabs',{
                    cabrecords:result
                });
            }
        });
    });
    app.get('/cab/:cabId', (req, res) => {
        pool.query('SELECT * FROM `cab_details_master` WHERE `ID` = ?', req.params.cabId, (error, result) => {
            if(error){res.send(error);}
            else{
                res.send(result);
            }
        });
    });

    app.post('/deletecab',(req,res)=>{
        pool.query('DELETE FROM `cab_details_master` WHERE `ID` = ?',req.body.cabid,(error,result)=>{
            if(error){res.send(error);}
            else{
                res.redirect('allcabs');
            }
        });
    })
    app.get('/logout', (req, res) => {
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