var http = require('http');
var https = require('https')
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('../confighttps');
var fs = require('fs');

var httpServer = http.createServer(function(req, res){
    unifiedServer(req, res);
   });

httpServer.listen(config.httpPort, function(){
    console.log("server listening to port "+config.httpPort+" in "+config.envName+" mode");
});

//create the var httpsServerOptions with key and certificate for encryption
var httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem'),
};

//instantiating https server
var httpsServer = https.createServer(httpsServerOptions, function(req,res){
    unifiedServer(req, res);
});

//creating https server
httpsServer.listen(config.httpsPort, function(){
    console.log("server listening to port "+config.httpsPort+" in "+config.envName+" mode");
})
// creating handlers
var handler = {};

handler.sample = function(data, callback){
    callback(406, {'name' : 'sample handler'});
}

//creating ping handler
handler.ping = function(data, callback){
    callback(200);
}

handler.notFound = function(data, callback){
    callback(404);
}

//welcome handler 
handler.hello = function(data, callback){
    callback(200, {'message' : 'Hi welcome to the hello page'});
}

// creating router
var router = {
    'sample' : handler.sample,
    'ping' : handler.ping,
    'hello' : handler.hello,
};

var unifiedServer = function(req, res){
     // to parse url
     var parseurl = url.parse(req.url, true);

     // to get path
     var path = parseurl.pathname;
 
     // trim url
     var trimpath = path.replace(/^\/+|\/+$/g, '');
     
     // to get http method
     var method = req.method.toLowerCase();
 
     // to parse querys from url
     var queryStringObject = parseurl.query;
 
     // to get headers
     var headers = req.headers;
 
     // to get the payload
     var decoder = new StringDecoder('utf-8');
     var buffer = '';
     req.on('data', function(data){
         buffer += decoder.write(data);        
     });
     req.on('end', function(){
         buffer += decoder.end();
 
         // selecting the handlers by the path
         var chosenHandler = typeof(router[trimpath]) !== 'undefined' ? router[trimpath] : handler.notFound;
 
         // data to be send to router
         var data = {
             'parsedurl':parseurl,
             'trimmedpath' : trimpath,
             'method' : method,
             'queryStringObject' : queryStringObject,
             'header' : headers,
             'payload' : buffer,
         }
         // sending data to handler
         chosenHandler(data, function(statusCode, payload){
 
             //checking for the statusCode
             statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
             
             //checking for payload
             payload = typeof(payload) == 'object' ? payload : {};
             
             //string the payload beacause browser can read on string
             payload = JSON.stringify(payload);
 
             //displaying in browser
             res.setHeader('Content-Type', 'application/json'); // to show it returns only json
             res.writeHead(statusCode);
             res.end(payload);
 
             //log the payload
             console.log("the response send is ", statusCode, payload);
         });
 
         //res.end("Inside payload\n");
         //console.log("the requested payload is ",buffer);
     });
     //send response to browser page
     //res.end('Hello World\n');
 
     // log info
     //console.log("The trimmed path is "+trimpath+" with the method of "+method+" has query parameter of ",queryStringObject);
     //console.log("header are given as follows: ",headers);
 
};