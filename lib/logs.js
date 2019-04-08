/*
*
* Library for storing and rotating logs
*
*/

//Dependencies
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');

//Container for the module
var lib = {};

// Base directory for logs folder
lib.BaseDir = path.join(__dirname, '/../.logs/');

//Append the string to the file. Check if the file already exists
lib.append = function(fileName, appendString, callback){
    //Append the str to the file
    fs.open(lib.BaseDir+fileName+'.log', 'a', function(err, fileDescriptor){
        if(!err && fileDescriptor){
            fs.appendFile(fileDescriptor, appendString + '\n', function(err){
                if(!err){
                    fs.close(fileDescriptor, function(err){
                        if(!err){
                            callback(false);
                        } else{
                            callback("Unable to close the file");
                        }
                    });
                } else{
                    callback("unable to append to the file");
                }
            });
        } else{
            callback("Unable to open and append to the file")
        }
    });
};

// List all the log files and optional include the compressed logs
lib.list = function(includeCompressed, callback){
    fs.readdir(lib.BaseDir, function(err, data){
        if(!err && data && data.length > 0){
            var trimmedFiles = [];
            data.forEach(function(fileName){
                if(fileName.indexOf('.log') > -1){
                    trimmedFiles.push(fileName.replace('.log',''));
                }

                //add on the .gz files to the array
                if(fileName.indexOf('.gz.b64') > -1 && includeCompressed){
                    trimmedFiles.push(fileName.replace('.gz.b64', ''));
                }
            });
            callback(false, trimmedFiles);
        } else{
            callback(err, data);
        }
    });
};


//compress the contents of one .log file to another .gz.b64 file within the same directory
lib.compress = function(logId, newFileId, callback){
    var sourceFile = logId + '.log';
    var destFile = newFileId + '.gz.b64';

    fs.readFile(lib.BaseDir+sourceFile, 'utf8', function(err, inputString){
        if(!err && inputString){
            // Compressing the data using gzip
            zlib.gzip(inputString, function(err, buffer){
                if(!err && buffer){
                    //Send the data to the destination file
                    fs.open(lib.BaseDir+destFile, 'wx', function(err, fileDescriptor){
                        if(!err &&  fileDescriptor){
                            //Write to the destination file
                            fs.writeFile(fileDescriptor, buffer.toString('base64'), function(err){
                                if(!err){
                                    //close the destination file
                                    fs.close(fileDescriptor, function(err){
                                        if(!err){
                                            callback(false);
                                        } else{
                                            callback(err);
                                        }
                                    });
                                } else{
                                    callback(err)
                                }
                            });
                        } else{
                            callback(err);
                        }
                    });
                } else{
                    callback(err);
                }
            }); 
        } else {
            callback(err);
        }
    })
};

//decompress the contents of a .gz.b64 file into a String variable
lib.decompress = function(fileId, callback){
    var fileName = fileId + '.gz.b64'
    fs.readFile(lib.BaseDir+fileName, 'utf8', function(err, str){
        if(!err && str){
            //decompress the string
            var inputBuffer = Buffer.from(str, 'base64');
            zlib.unzip(inputBuffer, function(err, outputBuffer){
                if(!err && outputBuffer){
                    //Callback
                    var str = outputBuffer.toString();
                    callback(false, str);
                } else{
                    callback(err);
                }
            });
        } else{
            callback(err);
        }
    });
}

//Truncating the old file
lib.truncate = function(logId, callback){
    fs.truncate(lib.BaseDir+logId+'.log', 0, function(err){
        if(!err){
            callback(false);
        } else{
            callback(err);
        }
    });
};
//Export the module
module.exports = lib;