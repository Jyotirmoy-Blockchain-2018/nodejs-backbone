
const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
const path = require('path');
const expressValidators = require('express-validator');
var mongo = require('mongodb');
var url = "mongodb://54.186.160.3:27017/";
// Create a DB Collection
// Template Engine Middle Ware
app.set('view engine','ejs');
app.set('views',path.join(__dirname+'/views'));

// Body Parser MiddleWare
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname+'public')));
app.use((req,res,next)=>{
    res.locals.errors = null;
    next();
});
require('./routes/routes')(app);
console.clear();
app.listen(2424, () => console.log('Server Listing on Port 2424!'));