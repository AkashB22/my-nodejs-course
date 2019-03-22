//dependencies
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

var lib = {};

lib.baseDir = path.join(__dirname,'/../.data/');
lib.create = function(dir, fileName, data, callback){
    fs.open(lib.baseDir+dir+'/'+fileName+'.json', 'wx', function(err, fileDescriptor){
        if(!err && fileDescriptor){
            var stringData = JSON.stringify(data);
            fs.write(fileDescriptor, stringData, function(err){
                if(!err){
                    fs.close(fileDescriptor, function(err){
                        if(!err){
                            callback(false);
                        }else {
                            callback('Error in closing the file');
                        }
                    });
                }else {
                    callback('Error in writing the file');
                }
            });
        }else {
            callback('could not able to create new file, it may already exists ');
        }
    });
};

lib.read = function(dir, file, callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json', function(err,data){
        if(!err && data){
            var parseData = helpers.parseJSONToObject(data);
            callback(false, parseData);
        } else{
        callback(err, data);
        }
    });
};

lib.update = function(dir, file, data, callback){
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', function(err, fileDescriptor){
        if(!err && fileDescriptor){
            var stringData = JSON.stringify(data);
            fs.truncate(fileDescriptor, function(err){
                if(!err){
                    fs.write(fileDescriptor, stringData, function(err){
                        if(!err){
                            fs.close(fileDescriptor, function(err){
                                if(!err){
                                    callback(false);
                                } else {
                                    callback('Error occured while closing the file');
                                }
                            });
                        } else {
                            callback('Error in updating the file');
                        }
                    });
                } else {
                    callback('Error while truncating the file')
                }
            });
        } else {
            callback('Error while opening the existing file');
        }
    });
};

lib.delete = function(dir, file, callback){
    fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){
        if(!err){
            callback(false);
        } else {
            callback('Error while deleting the file');
        }
    });
};

//list all the items in a directory
lib.list = function(dir, callback){
    fs.readdir(lib.baseDir+dir+'/',function(err, data){
        if(!err && data && data.length > 0){
            var trimmedFileNames = [];
            data.forEach(function(fileName){
                trimmedFileNames.push(fileName.replace('.json', ''));
            });
            callback(false, trimmedFileNames);
        } else {
            callback(err, data);
        }
    })
};
module.exports = lib;