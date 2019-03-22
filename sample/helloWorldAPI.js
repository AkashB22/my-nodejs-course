var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

var handler = {};

handler.hello = function(data, callback){
    callback(200, {'message' : 'Welcome User! Hello World'});
};

handler.notFound = function(data, callback){
    callback(404, {'error' : 'err'});
};
var router ={
    'hello' : handler.hello,
};

var server = http.createServer(function(req, res){
    var parseUrl = url.parse(req.url, true);
    var path = parseUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    console.log(trimmedPath);
    var decoder = new StringDecoder('utf-8');
    var buffer ='';
    req.on('data', function(data){
        buffer += decoder.write(data);
    })
    req.on('end', function(){
        buffer += decoder.end();
        var chooseHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handler.notFound;
        var data = {
            'parseUrl' : parseUrl,
            'path' : path,
            'trimmed path' : trimmedPath,
            'payload' : buffer,
        }
        chooseHandler(data, function(statusCode, payload){
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {};
            var stringPayload = JSON.stringify(payload)
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(stringPayload);
        });
    });
    });

server.listen(4000, function(){
    console.log("server started at port 4000");
});

