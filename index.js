/*
 *
 *Primary file for the API
 *
 */

 //Dependencies
 var server = require('./lib/server');
 var workers = require('./lib/workers');


 //Declare app
 var app={};

 //Init function
 app.init = function(){
    //start the server
    server.init();
    //start the workers
    workers.init();
 };

 //Execute that function
 app.init();

//Export the app
module.exports = app;
