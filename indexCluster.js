/*
 *
 *Primary file for the API
 *
 */

 //Dependencies
 var server = require('./lib/server');
 var workers = require('./lib/workers');
 var cli = require('./lib/cli');
 var cluster = require('cluster');
 var os  = require('os');


 //Declare app
 var app={};

 //Init function
 app.init = function(callback){

  //If we are on master thread run the background workers and cli
  if(cluster.isMaster){
    //start the workers
    workers.init();
    //Start the cli at last because it doesn't disturb our applcation
    setTimeout(function(){
      cli.init();
      callback();
    }, 50); 

    //fork the process
    for(var i=0; i<os.cpus().length; i++){
      cluster.fork();
    }
  } else{
    //If we are not on master thread run the server
    //start the server
    server.init();
    console.log(`Server ${process.pid} started`);
  }

    
 };

 //self invoking only if we call directly
 if(require.main === module){
  app.init(function(){});
 }

//Export the app
module.exports = app;
