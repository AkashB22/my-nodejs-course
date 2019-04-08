/*
 *
 *Primary file for the API
 *
 */

 //Dependencies
 var server = require('./lib/server');
 var workers = require('./lib/workers');
 var cli = require('./lib/cli');
 var exampleDebuggingProblem = require('./lib/exampleDebuggingProblem')


 //Declare app
 var app={};

 //Init function
 app.init = function(){
    //start the server
    debugger;
    server.init();
    debugger;
    //start the workers
    debugger;
    workers.init();
    debugger;
    //Start the cli at last because it doesn't disturb our applcation
    debugger;
    setTimeout(function(){
      cli.init();
    }, 50) 
    debugger; 

    //Set foo
    debugger;
    var foo =1;
    console.log('Just assign 1 to foo');
    debugger;

    //Increment foo
    debugger;
    foo++;
    console.log('Just incrementing foo');
    debugger;

    //Square foo
    debugger;
    foo = foo*foo;
    console.log('Just squaring foo');
    debugger;

    //convert foo to string
    debugger;
    foo = foo.toString();
    console.log('Just converting foo to string');
    debugger;

    //Call the init script that will throw
    debugger;
    exampleDebuggingProblem.init();
    console.log('Just called th libaray');
    debugger;
 };

 //Execute that function
 app.init();

//Export the app
module.exports = app;
