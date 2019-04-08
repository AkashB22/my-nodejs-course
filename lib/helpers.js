/*
* helpers for various tasks
*/
//dependencies
var crypto = require('crypto');//build in node module used to hash passwords by sha256
var config = require('./confighttps');
var https = require('https');
var querystring = require('querystring');
var fs = require('fs');
var path = require('path');
var http = require('http');

//container all for helper
var helpers ={};

//Sample function to return 1
helpers.getANumber = function(){
    return 1;
};

//Testing for apis
helpers.apiTestForGetReq = function(path, callback){
    //Configure the request details
    var requestDetails = {
        'protocol' : 'http:',
        'hostname' : 'localhost',
        'port' : config.httpPort,
        'method' : 'GET',
        'path' : path,
        'headers' : {
            'Content-Type' : 'application/json'
        }
    }

    var req = http.request(requestDetails, function(res){
        callback(res);
    });
    req.end();
}

//password hashing
helpers.hash = function(str){
    if(typeof(str) == 'string' && str.length > 0)
    {
        var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');//hashing with the sha256.
        return hash;
    } else {
        return false;
    }
};

//parse a  JSON String to an object in all cases, without throwing
helpers.parseJSONToObject = function(str){
    try{
        var obj = JSON.parse(str);
        return obj;
    } 
    catch(e) {
        return {};
    }
};

//create a random string of alphanumerics with the length given
helpers.createRandomString = function(strLength){
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if(strLength){
        //define all the possible creates that goes to the string
        var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        //Start the final string
        var str = '';

        for(i=1; i<=strLength; i++){
            //get a random character from the possibleString
            randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));

            //append that character to the final string
            str += randomCharacter;
        }
        //return the final string
        return str;
    } else {
        return false;
    }
};

helpers.sendSMSToTwilio = function(phone, msg, callback){
    //validate the parameters
    phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false;
    msg = typeof(msg) == 'string' && msg.length > 0 &&  msg.length <= 1600 ? msg : false;
    if(phone && msg){
        //configure the request payload
        var payload = {
            'From' : config.twilio.fromPhone,
            'To' : '+91'+phone,
            'Body' : msg,

        };

        //stringify the payload 
        var stringPayload = querystring.stringify(payload);

        //configure the request details
        var requestDetails = {
            'protocol' : 'https:',
            'hostname' : 'api.twilio.com',
            'method' : 'POST',
            'path' : '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
            'auth' : config.twilio.accountSid + ':' +config.twilio.authToken,
            'headers': {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Content-Length' : Buffer.byteLength(stringPayload),
            }
        };
        
        //instantiate the request object
        var req = https.request(requestDetails, function(res){
            // Grab the status of the request sent
            var status = res.statusCode;
            // callback successful if the request went through
            if(status == 200 || status ==201){
                callback(false);
            } else {
                callback('Status code return is ' + status);
            }
        });

        //Bind to the error event so error is thrown
        req.on('error', function(e){
            callback(e);
        });

        // Add the payload to the request
        req.write(stringPayload);

        //End the request
        req.end();
    } else {
        callback('Given parameter is not given or valid');
    }
};

//Get the String Contents of the template
helpers.getTemplate = function(templateName, data, callback){
    data = typeof(data) == 'object' && data !== null ? data : {};
    templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
    if(templateName){
        var templateDir = path.join(__dirname, '/../template/');
        fs.readFile(templateDir + templateName + '.html', 'utf-8', function(err, str){
            if(!err && str && str.length > 0){
                //do Interpolation on the string
                var finalString = helpers.interpolate(str, data);
                callback(false, finalString);
            } else {
                callback(true, "no template found");
            }
        });
    } else {
        callback(true, "a valid string is not specified");
    }
};


//Add the universal header and footer to the string and pass provided data object to header and footer
helpers.universalTemplate = function(str, data, callback){
    str = typeof(str) == 'string' && str.length > 0 ? str : '';
    data = typeof(data) =='object' && data !== null ? data : {};

    //get the Header
    helpers.getTemplate('header', data, function(err, headerString){
        if(headerString && !err){
            //Get the footer
            helpers.getTemplate('footer', data, function(err, footerString){
                if(footerString && !err){
                    var fullString = headerString + str + footerString;
                    callback(false, fullString);
                } else {
                    callback("we could not find the footer template")
                }
            });
        } else {
            callback("we could not find the header template");
        }
        
    });
}; 

//take the str and data object, find and replace all the keys in it
helpers.interpolate = function(str, data){
    str = typeof(str) == 'string' && str.length > 0 ? str : '';
    data = typeof(data) =='object' && data !== null ? data : {};

    // add the templateGlobals to the data object, prepending their key name with globals
    for(var keyName in config.templateGlobals){
        if(config.templateGlobals.hasOwnProperty(keyName)){
            data['global.'+keyName] = config.templateGlobals[keyName];
        }
    }

    // for each key in the data object add them at the corresponding placeHolder
    for(var key in data){
        if(data.hasOwnProperty(key) && typeof(data[key]) == 'string'){
            var replace = data[key];
            var find = '{'+key+'}';
            str = str.replace(find, replace);
        }
    }

    return str;
};

//Get the contents of public static asset
helpers.getStaticAsset = function(fileName, callback){
    fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;
    if(fileName){
        var publicDir = path.join(__dirname, '/../public/');
        fs.readFile(publicDir + fileName, function(err, data){
            if(!err && data){
                callback(false, data);
            } else {
                callback("Not able to read the file or file not found");
            }
        });
    } else {
        callback("A valid fileName was not specified");
    }
};
//exporting the module
module.exports = helpers;