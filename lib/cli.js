/*
*These are CLI related tasks
*
*/

var readline = require('readline');
var util = require('util');
var debug = util.debuglog('cli');
var events = require('events');
var os = require('os');
var v8 = require('v8');
var childProcess = require('child_process');
var _data = require('./data');
var _logs = require('./logs');
var _helpers = require('./helpers');
class _events extends events{};
var e = new _events();

//Instantiate a CLI module object 
var cli = {};

//Input Handlers
e.on('man', function(str){
    cli.responders.help();
});
e.on('help', function(str){
    cli.responders.help();
});
e.on('exit', function(str){
    cli.responders.exit();
});
e.on('stats', function(str){
    cli.responders.stats();
});
e.on('list users', function(str){
    cli.responders.listUsers();
});
e.on('more user info', function(str){
    cli.responders.moreUserInfo(str);
});
e.on('list checks', function(str){
    cli.responders.listChecks(str);
});
e.on('more check info', function(str){
    cli.responders.moreCheckInfo(str);
});
e.on('list logs', function(str){
    cli.responders.listLogs();
});
e.on('more log info', function(str){
    cli.responders.moreLogInfo(str);
});


//Responder Object
cli.responders = {}

cli.horizontalLine = function(){
    var width = process.stdout.columns;
    var line = '';
    for(var i=0;i<width;i++){
        line+='-'
    }
    console.log(line);
};
cli.center = function(str){
    var padding = process.stdout.columns;
    var line = '';
    padding = Math.floor((padding-str.length)/2);
    for(var i=0;i<padding;i++){
        line+=' ';
    }
    line+=str;
    console.log(line);
}
cli.verticalSpaces = function(lines){
lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
for(var i=0;i<lines;i++){
    console.log('');
}
}

//help / man
cli.responders.help = function(){
    var commands = {
        'man' : 'This is used for commands help manual',
        'help' : 'This is used for commands help manual',
        'exit' : 'This is used to exit from the command prompt',
        'stats' : 'This is used to provide important statistics of user information',
        'list users' : 'This is used to give the list of users',
        'more user info --{userId}' : 'This is used to give complete details for a particular user',
        'list checks --{up} or --{down}' : 'This is used to provide all the checks create with respect to --up or --down',
        'more check info --{checkId}' : 'This is used to check on a particular checks full details',
        'list logs' : 'This is used to display all the logs that are compressed',
        'more log info --{fileName}' : 'This is used to display more details about a particular user',
    }
    cli.horizontalLine();
    cli.center("CLI COMMANDS");
    cli.horizontalLine();
    cli.verticalSpaces(2);
    //Show commands in yellow and dscription in white
    for(var key in commands){
        if(commands.hasOwnProperty(key)){
            var value = commands[key];
            var line = '\x1b[33m'+key+'\x1b[0m';
            var padding =  30 - key.length;
            for(var i=0;i<padding;i++){
                line+=' ';
            }
            line+=value;
            console.log(line);
            cli.verticalSpaces();
        }
    }
    cli.verticalSpaces(1);
    //End with a horizontal line
    cli.horizontalLine();
}
// For Exit
cli.responders.exit = function(){
    process.exit(0);
}
//For Stats
cli.responders.stats = function(){
    var stats = {
        'Load Average' : os.loadavg().join(', '),
        'CPU Count' : os.cpus().length,
        'Free Memory' : os.freemem(),
        'Server UpTime' : os.uptime(),
        'Current Malloced Memory' : v8.getHeapStatistics().malloced_memory,
        'Peak Malloced Memory' : v8.getHeapStatistics().peak_malloced_memory,
        'Used Heap Size' : v8.getHeapStatistics().used_heap_size,
        'Total Heap Size' : v8.getHeapStatistics().total_heap_size,
        'Allocate Heap Used (%)' : Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
        'Total Heap Size Limit' : v8.getHeapStatistics().heap_size_limit,
        'Available Heap Allocated(%)' : Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100)
    }

    cli.horizontalLine();
    cli.center("System Statistics");
    cli.horizontalLine();
    cli.verticalSpaces(2);

    //Print the system statistics
    for(var key in stats){
        if(stats.hasOwnProperty(key)){
            var value = stats[key];
            var padding = 30 - key.length;
            var line = '\x1b[33m' + key + '\x1b[0m';
            for(var i=0;i<padding;i++){
                line+= ' ';
            }
            line+= value;
            console.log(line);
            cli.verticalSpaces();
        }
    }
    cli.verticalSpaces(1);
    //End with an horizontal line
    cli.horizontalLine();
}
//For lists all users
cli.responders.listUsers = function(){
    cli.horizontalLine();
    cli.center("List Of Users");
    cli.horizontalLine()
    cli.verticalSpaces(2);

    _data.list('user', function(err, userIds){
        if(!err && userIds){
            userIds.forEach(function(userId){
                _data.read('user', userId, function(err, userData){
                    var line = 'Name: ' + userData.firstName + ' ' + userData.lastName + ' ' + 'Phone No: ' + userData.phone + ' ' + 'Checks: ';
                    var numberOfChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks.length : 0;
                    line+=numberOfChecks;
                    console.log(line);
                    cli.verticalSpaces();
                });
            });
        }
    });    
}
//For more user info
cli.responders.moreUserInfo = function(str){
    cli.horizontalLine();
    cli.center("User Specific Details");
    cli.horizontalLine()
    cli.verticalSpaces(2)
    var arr = str.split('--');
    var userId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : '';
    _data.read('user', userId, function(err, userData){
        if(!err && userData){
            delete userData.hashedPassword;
            console.dir(userData, {'colors' : true});
            cli.verticalSpaces(2);
            cli.horizontalLine();
        }
    });
}
//For listing all checks
cli.responders.listChecks = function(str){
    cli.horizontalLine();
    cli.center("List of checks");
    cli.horizontalLine();
    cli.verticalSpaces(2);
    _data.list('check', function(err, checkIds){
        if(!err && checkIds && checkIds.length > 0){
            checkIds.forEach(function(checkId){
                _data.read('check', checkId, function(err, checkData){
                    var state = typeof(checkData.state) == 'string' ? checkData.state : 'down';
                    var lowerString = str.toLowerCase();
                    if(lowerString.indexOf('--' + state) > -1 || (lowerString.indexOf('--down') == -1 && lowerString.indexOf('--up') == -1)){
                        var line = 'CheckId: ' + checkData.id + ' UserPhoneNo: ' + checkData.userPhone + ' Url: ' + checkData.protocol + '://' + checkData.url + ' method : ' + checkData.method + ' State: ' + checkData.state;
                        console.log(line);
                        cli.verticalSpaces();
                    }
                });
            });
        }
    });
}
//For more check info
cli.responders.moreCheckInfo = function(str){
    cli.horizontalLine();
    cli.center('More Check Info');
    cli.horizontalLine();
    cli.verticalSpaces(2);
    var arr = str.split('--');
    var checkId = typeof(arr[1]) == 'string' && arr[1].length > 0 ? arr[1] : '';
    _data.read('check', checkId, function(err, checkData){
        console.dir(checkData, {colors : true});
        cli.verticalSpaces();
    });
}
//For listing all logs
cli.responders.listLogs = function(){
    cli.horizontalLine();
    cli.center('List all the compressed log files');
    cli.horizontalLine();
    cli.verticalSpaces(2);
    var ls = childProcess.spawn('ls', ['./.logs']);
    ls.stdout.on('data', function(dataObj){
        var dataStr = dataObj.toString();
        var logFileNames = dataStr.split('\n');
        logFileNames.forEach(function(logFileName){
            if(typeof(logFileName) == 'string' && logFileName.length > 0 && logFileName.indexOf('-') > -1){
                console.log(logFileName.split('.')[0]);
                cli.verticalSpaces();
            }
        });
    });
}
//For more log info
cli.responders.moreLogInfo = function(str){
    cli.horizontalLine();
    cli.center('More Log Info');
    cli.horizontalLine();
    cli.verticalSpaces(2);
    var arr = str.split('--');
    var logFilename = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : '';
    _logs.decompress(logFilename, function(err, strData){
        if(!err && strData){
            console.log(strData);
            var arr = strData.split('\n');
            arr.forEach(function(jsonString){
                var logObject = _helpers.parseJSONToObject(jsonString);
                if(logObject && JSON.stringify(logObject) !== '{}'){
                    console.dir(logObject, {'colors' : true});
                    cli.verticalSpaces();
                }
            });
        }
    })
}


//Input Processors
cli.processInput = function(str){
    str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
    //only process if the user wrote something otherwise ignore it
    if(str){
        // Codify the unique strings that are identified as unique questions allowed to be asked
        var uniqueStringInputs=[
            'man',
            'help',
            'exit',
            'stats',
            'list users',
            'more user info',
            'list checks',
            'more check info',
            'list logs',
            'more log info'
        ];

        //Go through the possible inputs and emit and event when match is found
        var matchFound = false;
        var counter = 0;
        uniqueStringInputs.some(function(input){
            if(str.toLowerCase().indexOf(input) > -1){
                matchFound = true;

                //Emit an event matching the unique input and include the full string given by the user
                e.emit(input, str);
                return true;
            }
        });

        //If we reach the end of the loop and no match is found, then user to try again
        if(!matchFound){
            console.log("Sorry try again");
        }
    }
};

cli.init = function(){
    //Send a Start message to the console in blue
    console.log('\x1b[34m%s\x1b[0m', "The CLI in running");

    //Start the Interface
    var _interface = readline.createInterface({
       input: process.stdin,
       output: process.stdout,
       prompt:'' 
    });

    //Create an initial prompt
    _interface.prompt();

    //Handle each line input separately
    _interface.on('line', function(str){
        //Send to the Input processor
        cli.processInput(str)

        //re-initialize the prompt
        _interface.prompt();
    });

    //If the user stops the cli, kill the associated process
    _interface.on('close', function(){
        process.exit(0);
    });
};

//Export the CLI object
module.exports = cli;
