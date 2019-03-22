/*
 *
 *server File - server related tasks
 *
 * 
 */

//Dependencies
var http = require('http');
var https = require('https')
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./confighttps');
var fs = require('fs');
var handler = require('./handler');
var helpers = require('./helpers');
var path = require('path');
var util = require('util');
var debug = util.debuglog('server');


//Instantiate a server-module object
var server = {};

//Instantiating the server
server.httpServer = http.createServer(function(req, res){
    server.unifiedServer(req, res);
   });


//create the var httpsServerOptions with key and certificate for encryption
server.httpsServerOptions = {
    'key' : fs.readFileSync(path.join(__dirname,'./../https/key.pem')),
    'cert' : fs.readFileSync(path.join(__dirname,'./../https/cert.pem')),
};

//instantiating https server
server.httpsServer = https.createServer(server.httpsServerOptions, function(req,res){
    server.unifiedServer(req, res);
});

// creating router
server.router = {
    '' : handler.index,
    'account/create' : handler.accountCreate,
    'account/edit' : handler.accountEdit,
    'account/deleted' : handler.accountDeleted,
    'session/create' : handler.sessionCreate,
    'session/deleted' : handler.sessionDeleted,
    'checks/all' : handler.checksList,
    'checks/create' : handler.checksCreate,
    'checks/edit' : handler.checkEdit,
    'sample' : handler.sample,
    'ping' : handler.ping,
    'hello' : handler.hello,
    'api/user' : handler.user,
    'api/token' : handler.token,
    'api/check' : handler.check,
    'favicon.ico' : handler.favicon,
    'public' : handler.public,
};

server.unifiedServer = function(req, res){
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
         var chosenHandler = typeof(server.router[trimpath]) !== 'undefined' ? server.router[trimpath] : handler.notFound;
         
         //If the request is in public directory use the public handler instead
         chosenHandler = trimpath.indexOf('public/') > -1 ? handler.public : chosenHandler;
         
         // data to be send to router
         var data = {
             'parsedurl':parseurl,
             'trimmedpath' : trimpath,
             'method' : method,
             'queryStringObject' : queryStringObject,
             'header' : headers,
             'payload' : helpers.parseJSONToObject(buffer),
         }
         // sending data to handler
         chosenHandler(data, function(statusCode, payload, contentType){
            
            //If the contentType is not defined fall back to JSON(Determining the type of response)
            contentType = typeof(contentType) == 'string' ? contentType : 'json';
            

            //checking for the statusCode
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            
            var payloadString = "";
            //return the reponse-parts that are for content-specific
            if(contentType == 'json'){
                res.setHeader('Content-type', 'application/json'); // to show it returns only json
                 //checking for payload
                payload = typeof(payload) == 'object' ? payload : {};
                //string the payload beacause browser can read on string
                payloadString = JSON.stringify(payload);
            }

            if(contentType == 'html'){
                res.setHeader('Content-type', 'text/html'); // to show it returns only json
                payloadString = typeof(payload) == 'string' ? payload : '';
            }

            if(contentType == 'favicon'){
                res.setHeader('Content-type', 'image/x-icon'); // to show it returns only json
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }

            if(contentType == 'css'){
                res.setHeader('Content-type', 'text/css'); // to show it returns only json
                payloadString = typeof(payload) !== 'undefiend' ? payload : '';
            }

            if(contentType == 'png'){
                res.setHeader('Content-Type', 'image/png'); // to show it returns only json
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }

            if(contentType == 'jpg'){
                res.setHeader('Content-type', 'image/jpeg'); // to show it returns only json
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }

            if(contentType == 'plain'){
                res.setHeader('Content-type', 'text/plain'); // to show it returns only json
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }

            //return the response that are common for all 
            res.writeHead(statusCode);
            //console.log(payloadString);
            res.end(payloadString);

            //log the payload in green if response is 200 otherwise in red
            if(statusCode == 200){
            debug('\x1b[32m%s\x1b[0m', method.toUpperCase() + ' /' + trimpath+' '+ statusCode + ' ' + payload);
            } else{
            debug('\x1b[31m%s\x1b[0m', method.toUpperCase() + ' /' + trimpath + ' ' + statusCode + ' ' + payload);
            }
         });
 
         //res.end("Inside payload\n");
         //debug("the requested payload is ",buffer);
     });
     //send response to browser page
     //res.end('Hello World\n');
 
     // log info
     //debug("The trimmed path is "+trimpath+" with the method of "+method+" has query parameter of ",queryStringObject);
     //debug("header are given as follows: ",headers);
 
};

//Init function
server.init = function(){
    //Start the http server 
    server.httpServer.listen(config.httpPort, function(){
        console.log('\x1b[36m%s\x1b[0m', "server listening to port "+config.httpPort+" in "+config.envName+" mode");
    });

    //Start the https server
    server.httpsServer.listen(config.httpsPort, function(){
        console.log('\x1b[35m%s\x1b[0m', "server listening to port "+config.httpsPort+" in "+config.envName+" mode");
    });
}

//Export the server
module.exports = server;