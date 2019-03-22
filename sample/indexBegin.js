var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

var server = http.createServer(function(req, res){
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
        res.end("Inside payload\n");
        console.log("the requested payload is ",buffer);
    })
    //send response to browser page
    res.end('Hello World\n');

    // log info
    console.log("The trimmed path is "+trimpath+" with the method of "+method+" has query parameter of ",queryStringObject);
    console.log("header are given as follows: ",headers);
});

server.listen(3001, function(){
    console.log("server listening to port 3001 now");
});
