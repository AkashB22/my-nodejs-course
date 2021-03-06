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
 app.init = function(callback){
    //start the server
    server.init();
    //start the workers
    workers.init();
    //Start the cli at last because it doesn't disturb our applcation
    setTimeout(function(){
      cli.init();
      callback();
    }, 50) 
 };

 //self invoking only if we call directly
 if(require.main === module){
  app.init(function(){});
 }

//Export the app
module.exports = app;
