/*
 *
 *Primary file for the API
 *
 */

 //Dependencies
 var server = require('./lib/server');
 var workers = require('./lib/workers');
 var cli = require('./lib/cli');


 //Declare app
 var app={};

 //Init function
 app.init = function(){

    //declaring a global that strict mode should catch
    foo = "bar";

    //start the server
    server.init();
    //start the workers
    workers.init();
    //Start the cli at last because it doesn't disturb our applcation
    setTimeout(function(){
      cli.init();
    }, 50) 
 };

 //Execute that function
 app.init();

//Export the app
module.exports = app;
