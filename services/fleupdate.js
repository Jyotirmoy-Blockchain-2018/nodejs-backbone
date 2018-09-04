var request = require('request');
var fs = require('fs');
module.exports = function(Cardname,Accesstoken,req,res){
    var formData = {
        card: fs.createReadStream(__dirname+'/cards/'+Cardname+'.card'),
        name: Cardname
    };
    
    console.log(formData);
    request.post({
        url: 'http://54.186.160.3:3000/api/wallet/import?access_token=' + Accesstoken,
        formData: formData
    }, (err, httpResponse, body)=> {
        if (err) {
            res.send('upload failed:', err);
        }
        res.send('Upload successful!  Server responded with:', body);
    });
}