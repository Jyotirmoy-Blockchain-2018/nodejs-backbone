var request = require('request');
var pool = require('../db/db-config');
var JWT = require('jsonwebtoken');
const JwtGenerator = require('../services/jwtgenerator');
var mongo = require('mongodb').MongoClient;

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
            const user = {
                id:'1',
                username:'Jyotirmoy',
                email:'jyotirmoy2411@gmail.com'
            };
            JWT.sign({user: user},'secret',(error,token)=>{
                res.json({
                    token:token
                });
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

    app.post('/addcab',verifytoken,(req,res)=>{
        JWT.verify(req.token,'secret',(error,data)=>{
            if(error){
                res.sendStatus(403);
            }
            else{
                pool.query('INSERT INTO cab_details_master SET ?', req.body, (error, result) => {
                    if (error) { res.send(error); }
                    else {
                        res.redirect('/allcabs');
                    }
                });
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
// Authorization: Bearer
function verifytoken(req,res,next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== undefined){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else{
        res.sendStatus(403).send('Authorization Required');
    }
}