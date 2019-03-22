/*
 *
 *these are worker related tasks
 *
 */
 
//Dependencies
var path = require('path');
var fs = require('fs');
var _data = require('./data');
var https = require('https');
var http = require('http');
var helpers = require('./helpers');
var url = require('url');
var _logs = require('./logs');
var util = require('util');
var debug = util.debuglog('workers');

// Instantiate the workers object
var workers={}

//Timer to execute workers processes once per minute
workers.loop = function(){
    setInterval(function(){
        workers.gatherAllChecks()
    }, 1000 * 60);
};

//Sanity checking th check data
workers.validateCheckData = function(originalCheckData){
    originalCheckData = typeof(originalCheckData) == 'object' && originalCheckData != null ?  originalCheckData : false;
    originalCheckData.id = typeof(originalCheckData.id) == 'string' && originalCheckData.id.trim().length == 20 ? originalCheckData.id.trim() : false;
    originalCheckData.userPhone = typeof(originalCheckData.userPhone) == 'string' && originalCheckData.userPhone.trim().length == 10 ? originalCheckData.userPhone.trim() : false;
    originalCheckData.protocol = typeof(originalCheckData.protocol) == 'string' && ['http', 'https'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol : false;
    originalCheckData.url = typeof(originalCheckData.url) == 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim() : false;
    originalCheckData.method = typeof(originalCheckData.method) == 'string' && ['get', 'post', 'put', 'delete'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method : false;
    originalCheckData.successCodes = typeof(originalCheckData.successCodes) == 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ? originalCheckData.successCodes : [];
    originalCheckData.timeOutSeconds = typeof(originalCheckData.timeOutSeconds) == 'number' && originalCheckData.timeOutSeconds % 1 == 0 && originalCheckData.timeOutSeconds >= 1 && originalCheckData.timeOutSeconds <= 5 ? originalCheckData.timeOutSeconds : false;

    //Set the keys that may not be set if the workers have never seen this check before
    originalCheckData.state = typeof(originalCheckData.state) == 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down';
    originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) == 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;

    //If all the checks pass, pass the data along to the next step in the process
    if(originalCheckData.id &&
        originalCheckData.userPhone &&
        originalCheckData.protocol &&
        originalCheckData.url &&
        originalCheckData.method &&
        originalCheckData.successCodes &&
        originalCheckData.timeOutSeconds){
            workers.performCheck(originalCheckData);
        } else{
            debug('Error : one of the checks is not properly formatted. Skipping it.')
        }
};

//Perform the check, send the originalCheckData and the outcome of the check process, to the next step in the process
workers.performCheck = function(originalCheckData){
    // Prepare the initial check outcome
    var checkOutcome ={
        'error' : false,
        'responseCode' : false
    };

    //Mark that the outcome has not been sent yet
    var outcomeSent = false;

    //parse the host name and path out of the original check data
    var parseUrl = url.parse(originalCheckData.protocol + '://' + originalCheckData.url);
    var path = parseUrl.path; //path and not pathname because we need path with query string
    var hostname = parseUrl.hostname;

    //Construct the request
    var requestDetails = {
        'protocol' : originalCheckData.protocol + ':',
        'hostname' : hostname,
        'method' : originalCheckData.method.toUpperCase(),
        'path' : path,
        'timeOutSeconds' : originalCheckData.timeOutSeconds * 1000,
    };

    //Instantiate the request object( either using https or http)
    var _moduleToUse = originalCheckData.protocol == 'http' ? http : https;
    var req = _moduleToUse.request(requestDetails, function(res){
        //Grab the status of the sent request
        var status = res.statusCode;
        
        //Update the status to the checkOutcome and pass the data along
        checkOutcome.responseCode = status;
        if(!outcomeSent){
            workers.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });
    
    //Bind to the Error event so it does not get thrown
    req.on('error', function(e){
        checkOutcome.error = {
            'error' : true,
            'value' :e,
        };
        if(!outcomeSent){
            workers.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    //Bind to the timeout Second
    req.on('timeout', function(e){
        checkOutcome.error = {
            'error' : true,
            'value' :'timeout',
        };
        if(!outcomeSent){
            workers.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    //End the request
    req.end();
};

//Process the checkData, update the checkData if needed and trigger an alert to the user if needed
//special logic for accomdating a check that never has been tested before( do not alert on this to user) (ie)
//if a status is changed from down to up, we dont need to send an alert to the user since that is the default way to do things
workers.processCheckOutcome = function(originalCheckData, checkOutcome){
    //Decide if the check is considered to be up or down
    var state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

    //Decide if an Alert in required
    var alertWarranted = originalCheckData.lastChecked && originalCheckData.state != state ? true : false;

    //log the outcome
    var timeOfCheck = Date.now();
    workers.log(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck);

    //update the check data
    var newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = timeOfCheck;
    

    //save the update
    _data.update('check', originalCheckData.id, newCheckData, function(err){
        if(!err){
            //send the checkdata to the next phase of the process if needed
            if(alertWarranted){
                workers.alertUserToStatusChange(newCheckData);
            } else {
                debug("checkOutcome has not changed, no alert needed", checkOutcome);
            }
        } else {
            debug("Error trying to update to one of the checks")
        }
    });
    
workers.alertUserToStatusChange = function(newCheckData){
    var msg = "Alert: Your check for " + newCheckData.method.toUpperCase() + " " + newCheckData.protocol+ "://" + newCheckData.url + " is currently " + newCheckData.state;
    helpers.sendSMSToTwilio(newCheckData.userPhone, msg, function(err){
        if(!err){
            debug("User was alerted to a status change in their check via SMS: ",msg);
        } else {
            debug("Error: could not able to send sms alert to the user who had a state change in their check ", err, newCheckData.userPhone);
        }
    });
};
        

};

//Loop up all checks data, get their data and send data to a validator  
workers.gatherAllChecks = function(){
    //Get all the checks
    _data.list('check', function(err, checks){
        if(!err && checks && checks.length > 0){
            checks.forEach(function(check){
                //Data read for the particuler check
                _data.read('check', check, function(err, originalCheckData){
                    if(!err && originalCheckData){
                        //Pass the data to a check validator or let that function continue or log errors as needing
                        workers.validateCheckData(originalCheckData);
                    }
                });
            });
        } else{
            debug('Error : Could not find any checks in the process');
        }
    });
};

//Logging to the file
workers.log = function(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck){
    //Form the logData
    var logData = {
        'check' : originalCheckData,
        'outcome' : checkOutcome,
        'state' : state,
        'alert' : alertWarranted,
        'time' : timeOfCheck,
    };

    //Convert to string
    var logDataString = JSON.stringify(logData);

    //Determine the name of the log file
    var logFileName = originalCheckData.id;

    //Append the log string to the log file
    _logs.append(logFileName, logDataString, function(err){
        if(!err){
            debug("logging to the file succeeded ");
        } else{
            debug("logging to the file failed ");
        }
    });
};


//Compression loop - timer to execute the log rotation once per day
workers.logRotationLoop = function(){
    setInterval(function(){
        workers.rotateLogs();
    }, 1000 * 60 * 60 * 24);
};

//Rotate(compress) the log files
workers.rotateLogs = function(){
    //Listing all the non-compress files in .logs folder
    _logs.list(false, function(err, logs){
        if(!err && logs){
            logs.forEach(function(logName){
                //compress the data to the different file
                var logId = logName.replace('.log','');
                var newFileId = logId+'-'+Date.now();
                _logs.compress(logId, newFileId, function(err){
                    if(!err){
                        //Truncating the log
                        _logs.truncate(logId, function(err){
                            if(!err){
                                debug("Success truncating log file");
                            } else{
                                debug("Error truncating the log file");
                            }
                        });
                    } else{
                        debug("Error compressing one of the files");
                    }
                }); 
            });
        } else{
            debug("Error : Could not find any logs to rotate");
        }
    });
};

//Init script
workers.init =  function(){
    //Eexecute all the checks immediately
    workers.gatherAllChecks();

    //console workers have started in different colour console.log - has string interpolation
    console.log('\x1b[33m%s\x1b[0m',"Background workers are running");

    //Call a loop, so that the checks will be execute later on
    workers.loop();

    //compress all the loop immediately
    workers.rotateLogs();

    //compression loop that rotates the old logs everyday
    workers.logRotationLoop();

};


//export the workers object
module.exports = workers;