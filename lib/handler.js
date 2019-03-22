var _data = require('./data');
var helpers = require('./helpers');
var config = require('./confighttps');
// creating handlers
var handler = {};

handler.sample = function(data, callback){
    callback(406, {'name' : 'sample handler'});
}

//creating ping handler
handler.ping = function(data, callback){
    callback(200);
}

handler.notFound = function(data, callback){
    callback(404,{'Error' : 'Page not found'});
}

//welcome handler 
handler.hello = function(data, callback){
    callback(200, {'message' : 'Hi welcome to the hello page'});
}

/*
*
* HTML contentType handlers
*
*/

//index handler
handler.index = function(data, callback){
    //Reject any request that is not a GET request
    if(data.method == 'get'){

        //Prepare data for interpolation
        var templateData = {
            'head.title' : 'Uptime Monitoring',
            'head.description' : 'This site lets you know the uptime of your HTTP/HTTPS site and notify you whenever the site goes down',
            'body.class' : 'index'
        };
        //Read in the template as a STRING
        helpers.getTemplate('index', templateData, function(err, str){
            if(!err && str){
                //Add the universal header and footer
                helpers.universalTemplate(str, templateData, function(err, str){
                    if(!err && str){
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html')
                    }
                });

            } else{
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

//Account create handler
handler.accountCreate = function(data, callback){
    //accept only get method
    if(data.method == 'get'){
        //Prepare data for interpolation
        var templateData = {
            'head.title' : 'Account Creation',
            'head.description' : 'Simple way to create new account',
            'body.class' : 'accountCreate'
        }

        //Get the template to display
        helpers.getTemplate('accountCreate', templateData, function(err, str){
            if(!err && str){
                //get the universal header and footer
                helpers.universalTemplate(str, templateData, function(err, str){
                    if(!err && str){
                        // return that page as html
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                })
            } else {
                callback(500, undefined, 'html');
            }
        })
    } else {
        callback(405, undefined, 'html')
    }
};

//Seesion Creation
handler.sessionCreate = function(data, callback){
    //allow only GET request
    if(data.method == 'get'){
        // Add the template data
        var templateData = {
            'head.title' : 'Account Login',
            'head.description' : 'Login with your mobile number and password',
            'body.class' : 'sessionCreate',
        };
        //get the template from public folder
        helpers.getTemplate('sessionCreate', templateData, function(err, str){
            if(!err && str){
                //get universal headers and footers
                helpers.universalTemplate(str, templateData, function(err, str){
                    if(!err && str){
                        callback(200, str,'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                })
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

//Session has been deleted
handler.sessionDeleted = function(data, callback){
if(data.method == 'get'){
    var templateData = {
        'head.title' : 'Logged out successfully',
        'head.description' : 'Logged out from your account and session has been deleted',
        'body.class' : 'sessionDeleted',
    };
    helpers.getTemplate('sessionDeleted', templateData, function(err, str){
        if(str){
            helpers.universalTemplate(str, templateData, function(err, str){
                if(str){
                    callback(200, str, 'html');
                } else {
                    callback(500, undefined, 'html');
                }
            })
        } else {
            callback(500, undefined, 'html');
        }
    });
} else {
    callback(405, undefined, 'html');
}
};

//Account Edit
handler.accountEdit = function(data, callback){
    if(data.method == 'get'){
        var templateData = {
            'head.title' : 'Account Settings',
            'body.class' : 'accountEdit'
        };
        helpers.getTemplate('accountEdit', templateData, function(err, str){
            if(!err && str){
                helpers.universalTemplate(str, templateData, function(err, str){
                    if(!err && str){
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

//Account delete
handler.accountDeleted = function(data, callback){
    if(data.method == 'get'){
        var templateData = {
            'head.title': 'Account deletion',
            'head.description': 'Your account has been deleted',
            'body.class': 'accountDelete'            
        };

        helpers.getTemplate('accountDelete', templateData, function(err, str){
            if(!err && str){
                helpers.universalTemplate(str, templateData, function(err, str){
                    if(!err && str){
                        callback(200, str, 'html');
                    }
                });
            } else{
                callback(500, undefined, 'html');
            }
        });
    } else{
        callback(405, undefined, 'html');
    }
}

//Creating a new check called checks create
handler.checksCreate = function(data, callback){
    //reject any request other than GET
    if(data.method == 'get'){
        //Prepare data interpolation
        var templateData = {
            'head.title' : 'Create a new checks',
            'body.class' : 'ChecksCreate'
        }
        helpers.getTemplate('checksCreate', templateData, function(err, str){
            if(!err && str){
                helpers.universalTemplate(str, templateData, function(err, str){
                    if(!err && str){
                        callback(200, str, 'html');
                    } else{
                        callback(500, undefined, 'html');
                    }
                })
            } else{
                callback(500, undefined, 'html');
            }
        })
    } else{
        callback(405, undefined, 'html');
    }
}

//dashboard 
handler.checksList = function(data, callback){
    if(data.method=='get'){
        var templateData = {
            'head.title' : 'User dashboard page',
            'body.class' : 'checkLists'
        }
        helpers.getTemplate('checkLists', templateData, function(err, str){
            if(!err && str){
                helpers.universalTemplate(str, templateData, function(err, str){
                    if(!err && str){    
                        callback(200, str, 'html')
                    } else{
                        callback(500,undefuned,'html')
                    }
                });
            } else{
                callback(500, undefined, 'html');
            }
        });
    } else{
        callback(405, undefined, 'html');
    }
}

//Check Edits page
handler.checkEdit = function(data, callback){
    if(data.method == 'get'){
        var templateData = {
            'head.title' : 'Edit/ view/ delete your checks',
            'body.class' : 'checkEdit'
        };
        helpers.getTemplate('checkEdit', templateData, function(err, str){
           if(!err && str){
                helpers.universalTemplate(str, templateData, function(err, str){
                    if(!err && str){
                        callback(200, str, 'html');
                    } else{
                        callback(500, undefined, 'html');
                    }
                });
           } else{
               callback(500, undefined, 'html');
           }
        });
    } else{
        callback(405, undefined, 'html');
    }
};

//favicon
handler.favicon = function(data, callback){
    //Reject any request that is not GET
    if(data.method == 'get'){
        //Read in the favicon 
        helpers.getStaticAsset('favicon', function(err, data){
            if(!err && data){
                callback(200, data, 'favicon');
            } else {
                callback(500);
            }
        });
    } else {
        callback(405);
    }
}

//Public assets
handler.public = function(data, callback){
    //Reject other methods that are not get
    if(data.method == 'get'){
        //Get the file name request in order to find what they are asking for
        var trimmedAssetName = data.trimmedpath.replace('public/', '').trim();
        if(trimmedAssetName.length > 0){
            //Read in the assets data
            helpers.getStaticAsset(trimmedAssetName, function(err, data){
                if(!err && data){
                    //Determine the content-type based on the file and if not know default it to text/plain
                    var contentType = 'plain';
                    if(trimmedAssetName.indexOf('.css') > -1){
                        contentType = 'css';
                    }
                    if(trimmedAssetName.indexOf('.jpg') > -1){
                        contentType = 'jpg';
                    }
                    if(trimmedAssetName.indexOf('.png') > -1){
                        contentType = 'png';
                    }
                    if(trimmedAssetName.indexOf('.ico') > -1){
                        contentType = 'favicon';
                    }
                    //callback the data
                    callback(200, data, contentType);
                } else {
                    callback(500);
                }
            });
        } else {
            callback(404);
        }
    } else {
        callback(405);
    }
}
/*
*
*User api JSON handlers
*
*/
//user handler for api
handler.user = function(data, callback){
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if( acceptableMethods.indexOf(data.method) > -1){
        handler._users[data.method](data,callback);
    } else {
        callback(405,"method not allowed");//405 is the status for method not allowed
    }
}

//creating a new container that is not accessable in index.js
handler._users={};

//users-post
//required data: Firstname, lastname, phone, password, tosagreement
//optional data: none
handler._users.post = function(data, callback){
    //sanity check - check that all required fields are filled out
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone)  == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password)  == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement)  == 'boolean' && data.payload.tosAgreement == true ? true : false;
    //@TODO delete
    console.log(firstName + lastName + phone + password+ tosAgreement);
    if(firstName && lastName && phone && password && tosAgreement){
        // make sure user doesn't already exists - check in .data folder for finding the already existing users
        _data.read('.data', phone, function(err, data){
            if(err){
                //hash the password
                var hashedPassword = helpers.hash(password);

                //sanity check for hashed password
                if(hashedPassword)
                {
                    //creating user object
                    var userObject ={
                        'firstName' : firstName,
                        'lastName' : lastName,
                        'phone' : phone,
                        'hashedPassword' : hashedPassword,
                        'tosAgreement' : tosAgreement,
                    }
                    _data.create('user', phone, userObject, function(err){
                        if(!err){
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {'Error' : 'could not create the new user'});
                        }
                    });
                } else {
                    callback(500, {'Error' : 'Could not able to hash the password'});
                }
            } else {
                //user already exists
                callback(400, {'Error' : 'User with that phone number already exists'});
            }
        });
    } else {
        callback(400, {'Error' : 'Missing Required fields'})
    }
} 

//users-get
//require data : phone
//optional data : null
handler._users.get = function(data, callback){
    //check that the phone number is valid
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone : '';
    if(phone){
        var tokenId = typeof(data.header.tokenid) == 'string' && data.header.tokenid.trim().length == 20 ? data.header.tokenid : false;
        
        //verify the token is valid for given user
        handler._token.verifyTokenId(tokenId, phone, function(tokenIdValid){
            if(tokenIdValid){
                _data.read('user', phone, function(err, data){
                    if(!err && data){
                        //remove the hashed password
                        delete data.hashedPassword;
                        callback(200, data);
                    } else {
                        callback(404, {'Error' : 'data not found and provide the correct phone number'});
                    }
                });
            } else {
                callback(403, {'Error' : 'token has been expired or not valid'});
            }
        });
    } else {
        callback(400, {'Error' : 'phone number not given'});
    }
}; 

//users-put
//Required data : phone
//optional data : firstName, lastName, password but atleast one must be specified
handler._users.put = function(data, callback){
    //check for required field
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : '';
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var password = typeof(data.payload.password)  == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    
    if(phone){
        if(firstName || lastName || password){
            //verify TokenId
            var tokenId = typeof(data.header.tokenid) == 'string' && data.header.tokenid.trim().length == 20 ? data.header.tokenid : false;
            handler._token.verifyTokenId(tokenId, phone, function(tokenIsValid){
                if(tokenIsValid){
                    //lookup user
                    _data.read('user', phone, function(err,userData){
                        if(!err && userData){
                        if(firstName){
                            userData.firstName = firstName;
                        }     
                        if(lastName){
                            userData.lastName = lastName;
                        }
                        if(password){
                            var hashedPassword = helpers.hash(password);
                            userData.hashedPassword = hashedPassword; 
                        }
                        _data.update('user', phone, userData, function(err){
                            if(!err){
                                callback(200);
                            } else {
                                console.log(err);
                                callback(500, {'Error' : 'not able to update the fields'});
                            }
                        });
                        } else {
                            callback(400,{'Error' : 'The specified user does not exists'});
                        }
                    });
                } else {
                    callback(403, {'Error' : 'Token has been expired or not valid'});
                }
            });
        } else {
            callback(400, {'Error' : 'Missing fields to update'});
        }
    } else {
        callback(400, {'Error' : 'Missing required field'});
    }
} 

//users-delete
//Required field phone
handler._users.delete = function(data, callback){
    //check whether the phone is valid
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone : '';
    if(phone){
        var tokenId = typeof(data.header.tokenid) == 'string' && data.header.tokenid.trim().length == 20 ? data.header.tokenid : false;

        handler._token.verifyTokenId(tokenId, phone, function(tokenIsValid){
            if(tokenIsValid){
                //Look for user
                _data.read('user', phone, function(err, userData){
                    if(!err && userData){
                        //delete user data
                        _data.delete('user', phone, function(err){
                            if(!err){
                                //Delete each of the checks associated with the user
                                var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                                var checksToDelete = userChecks.length;
                                if(checksToDelete > 0){
                                    var checksDeleted = 0;
                                    var deletionErrors = 0;
                                    userChecks.forEach(function(checkId){
                                        _data.delete('check', checkId, function(err){
                                            if(err){
                                               deletionErrors = true;
                                            } 
                                            checksDeleted++;
                                            if(checksDeleted == checksToDelete){
                                                if(!deletionErrors){
                                                    callback(200);
                                                } else {
                                                    callback(500, {'Error' : 'Errors encountered while attempting to delete all of the user\'s checks.All checks may not be deleted from the system successfully'})
                                                }
                                            }
                                        });
                                    });
                                } else {
                                    callback(200);
                                }
                            } else {
                                callback(500, {'Error' : 'could not able to delete user'});
                            }
                        });
                    } else {
                        callback(404, {'Error' : 'data not found and provide the correct phone number'});
                    }
                });
            } else {
                callback(403, {'Error' : 'token has been expired or not valid'});
            }
        });
    } else {
        callback(400, {'Error' : 'phone number not given'});
    }
} 

//Tokens
handler.token = function(data, callback){
    var acceptableMethod = ['post', 'get', 'put', 'delete'];
    if(acceptableMethod.indexOf(data.method) > -1){
        handler._token[data.method](data, callback);
    } else {
        callback(405 , {'Error' : 'Method not found'});
    }
};

//container for all the submethod
handler._token = {};

//Token post
//required phone and password
//optional none
handler._token.post = function(data, callback){
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : '';
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : '';
    if(phone && password){
        //lookup the user who matches that phone
        _data.read('user', phone, function(err, userData){
            if(!err && userData){
                var hashedPassword = helpers.hash(password);
                if(hashedPassword == userData.hashedPassword){
                    //if valid create a new token with random name set expiration date 1 hour in the future
                    var tokenId = helpers.createRandomString(20);
                    var expires = Date.now() + 1000*60*60;

                    //tokenObject creation
                    var tokenObject = {
                        'phone' : phone,
                        'tokenId' : tokenId,
                        'expires' : expires,
                    };

                    _data.create('token', tokenId, tokenObject, function(err){
                        if(!err){
                            callback(200, tokenObject);
                        } else {
                            callback(500 , {'Error' : 'could not create new token'})
                        }
                    });

                } else {
                    callback(400, {'Error' : 'password didnot match the specied user store password'});
                }
            } else {
                callback(400, {'Error' : 'User can not be found'});
            }
        });
    } else {
        callback(400, {'Error' : 'Missing required fields'});
    }
};

//Token get
//Required : tokenId
//optional : none
handler._token.get = function(data, callback){
    var tokenId = typeof(data.queryStringObject.tokenId) == 'string' && data.queryStringObject.tokenId.trim().length == 20 ? data.queryStringObject.tokenId : '';
    if(tokenId){
        _data.read('token', tokenId, function(err, data){
            if(!err, data){
                callback(200, data);
            } else {
                callback(404, {'Error' : 'tokenId not found'});
            }
        });
    } else {
        callback(400, {'Error' : 'Missing required fields or wrong data'});
    }
};

//Token put
//Required : tokenId , extend
//optional data : null
handler._token.put = function(data, callback){
    var tokenId = typeof(data.payload.tokenId) == 'string' && data.payload.tokenId.trim().length == 20 ? data.payload.tokenId.trim() : '';
    var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
    if(tokenId && extend)
    {
        _data.read('token', tokenId, function(err, tokenData){
            if(!err && tokenData){
                //check whether the token expire is validate, not expired
                if(tokenData.expires > Date.now()){
                    tokenData.expires = Date.now() + 1000*60*60;
                _data.update('token', tokenId, tokenData, function(err){
                    if(!err){
                        callback(200);
                    } else {
                        callback(500, {'Error' : 'unable to update the token\'s expiration' });
                    }
                });
                } else {
                    callback(400, {'Error' : 'Your token has already expired can not extend'})
                }
            } else {
                callback(400, {'Error' : 'specified token Id does not exists'});
            }
        });
    } else {
        callback(400, {'Error' : 'Missing required fields'});
    }
};

//Token delete
//Required data : tokenId
//optional data : none 
handler._token.delete = function(data, callback){
    var tokenId = typeof(data.queryStringObject.tokenId) == 'string' && data.queryStringObject.tokenId.trim().length == 20 ? data.queryStringObject.tokenId : '';
    if(tokenId){
        _data.read('token', tokenId, function(err, data){
            if(!err && data){
                _data.delete('token', tokenId, function(err){
                    if(!err){
                        callback(200);
                    } else {
                        callback(500, {'Error' : 'unable to delete token'})
                    }
                })
            } else {
                callback(404, {'Error' : 'token not found'});
            }
        })
    } else {
        callback(400, {'Error' : 'Missing required fields'});
    }
};

//Verify whether the token Id has a valid expiration
handler._token.verifyTokenId = function(tokenId, phone, callback){
    //lookup token
    _data.read('token', tokenId, function(err, tokenData){
        if(!err && tokenData){
            if(tokenData.phone == phone && tokenData.expires > Date.now()){
                callback(true);
            } else {
                callback(false);
            } 
        } else {
            callback(false);
        }
    });
}

handler.check= function(data, callback){
    var acceptableMethods = ['post', 'get', 'put', 'delete'];

    if(acceptableMethods.indexOf(data.method) > -1){
        handler._check[data.method](data, callback);
    } else {
        callback(405, {'Error' : 'illegal method Or this method is not allowed'});
    }
}

//container for check method
handler._check = {};

//check- post
//required data : protocol, url, method,successCodes, timeoutSeconds
//optional data : null
handler._check.post =function(data, callback){
    var protocol = typeof(data.payload.protocol) == 'string' && ['http' , 'https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put','delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : [];
    var timeOutSeconds = typeof(data.payload.timeOutSeconds) == 'number' && data.payload.timeOutSeconds % 1 == 0 && data.payload.timeOutSeconds >= 1 && data.payload.timeOutSeconds <= 5 ? data.payload.timeOutSeconds : false;  
    if(protocol && url && method && successCodes && timeOutSeconds){
        //get the token from the header
        var token = typeof(data.header.tokenid) == 'string' && data.header.tokenid.trim().length == 20 ? data.header.tokenid.trim() : false;

        _data.read('token', token, function(err, tokenData){
            if(!err && tokenData){
                var userPhone = tokenData.phone;

                //lookup user data
                _data.read('user', userPhone, function(err, userData){
                    if(!err && userData){
                        var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                        //Verify that the user has less than number of max-checks-per-user
                        if(userChecks.length < config.maxChecks){
                            //create a random id for check
                            var checkId = helpers.createRandomString(20);

                            //create check object with the particular user
                            var checkObject = {
                                'id' : checkId,
                                'userPhone' : userPhone,
                                'protocol' : protocol,
                                'url' : url,
                                'method' : method,
                                'successCodes' : successCodes,
                                'timeOutSeconds' : timeOutSeconds,
                            };

                            //save the object 
                            _data.create('check', checkId , checkObject, function(err){
                                if(!err){
                                    //Add the checkid to userData
                                    userData.checks = userChecks;
                                    userData.checks.push(checkId);

                                    //Save the new userData
                                    _data.update('user', userPhone, userData, function(err){
                                        if(!err){
                                            //return the data about the new check
                                            callback(200, checkObject);
                                        } else {
                                            callback(500, {'Error' : 'could not able to update the new userData'})
                                        }
                                    })
                                } else {
                                    callback(500, {'Error' :'Could not create the new check'});
                                }
                            })
                        } else {
                            callback(400, {'Error' : 'maximum checks(' + config.maxChecks + ') for that user reached cannot create'});
                        }

                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(400, {'Error' : 'token has expired or not a valid token'});
            }
        });
    } else {
        callback(400,{'Error' : 'Missing required fields or input are not valid'})
    }
};


//check - get
//required data : Id
//optional data : none
handler._check.get = function(data, callback){
    
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;

    if(id){
        _data.read('check', id, function(err, checkData){
            if(!err && data){
                var token = typeof(data.header.tokenid) == 'string' ? data.header.tokenid : false;

                handler._token.verifyTokenId(token, checkData.userPhone, function(tokenIsValid){
                    if(tokenIsValid){
                        callback(200, checkData);
                    } else {
                        callback(403, {'Error' : 'Missing required token in the header or token is invalid'});
                    }
                })
            } else {
                callback(404);
            }
        })
    } else {
        callback(404, {'Error' : 'Missing required fields'})
    }
};

//check - put
//required data- id
//optional data - protocol, url, method, successcodes, timeoutseconds anyone must be given
handler._check.put = function(data, callback){
    //check the required field
    var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() :false;
    //check the optional field
    var protocol = typeof(data.payload.protocol) == 'string' && ['http', 'https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : [];
    var timeOutSeconds = typeof(data.payload.timeOutSeconds) == 'number' && data.payload.timeOutSeconds % 1 == 0 ? data.payload.timeOutSeconds : false;

    if(id){
        //check to see atleast one optional data is mentioned
        if(protocol || url || method || successCodes || timeOutSeconds){
            //lookup the check
            _data.read('check', id, function(err, checkData){
                if(!err && checkData){
                    //get token from header
                    var token = typeof(data.header.tokenid) && data.header.tokenid.length == 20 ? data.header.tokenid : false;
                    
                    //verify the token
                    handler._token.verifyTokenId(token, checkData.userPhone, function(tokenIsValid){
                        if(tokenIsValid){
                            if(protocol){
                                checkData.protocol = protocol;
                            }
                            if(url){
                                checkData.url = url;
                            }
                            if(method){
                                checkData.method = method;
                            }
                            if(successCodes){
                                checkData.successCodes = successCodes;
                            }
                            if(timeOutSeconds){
                                checkData.timeOutSeconds = timeOutSeconds;
                            }

                            // store the updates
                            _data.update('check', id, checkData, function(err){
                                if(!err){
                                    callback(200);
                                } else{
                                    callback(500, {'Error' : 'Could not update the checks'});
                                }
                            });
                        } else {
                            callback(404, {'Error' : 'Missing token or Invalid token '})
                        }
                    })
                } else {
                    callback(500, {'Error' : 'Check Id did not match'});
                }
            });
        } else {
            callback(400, {'Error' : 'Missing field to update'});
        }

    } else {
        callback(400, {'Error' : 'Missing required fields'});
    }
};


//checks - delete
//Required data : Id
// no optional data

handler._check.delete = function(data, callback){
    //Check whether the Id is valid
    var ID = typeof(data.queryStringObject.ID) == 'string' && data.queryStringObject.ID.trim().length == 20 ? data.queryStringObject.ID.trim() : false;
    if(ID){
        //Lookup the check
        _data.read('check', ID, function(err,checkData){
            if(!err && checkData){
                var token = typeof(data.header.tokenid) == 'string' ? data.header.tokenid : false;
                if(token){
                    handler._token.verifyTokenId(token, checkData.userPhone, function(tokenIsValid){
                        if(tokenIsValid){
                            // delete the check data
                            _data.delete('check', ID, function(err){
                                if(!err){
                                    _data.read('user', checkData.userPhone, function(err, userData){
                                        if(!err, userData){
                                            var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                                            //Remove the checks from user data
                                            var checkPosition = userChecks.indexOf(ID);
                                            if(checkPosition > -1){
                                                userChecks.splice(checkPosition, 1);
                                                // Resave the checks array to user Data
                                                _data.update('user', checkData.userPhone, userData, function(err){
                                                    if(!err){
                                                        callback(200);
                                                    } else {
                                                        callback(500, {'Error' : 'Could not update the user data'})
                                                    }
                                                });
                                            } else {
                                                callback(500, {'Error' : 'Could not find the checks on the user object, so could not delete the check in user object'});
                                            }
                                        } else{
                                            callback(500, {'Error': 'could not find the user who created the check, so could not remove the check from the list of checks from the user object'})
                                        }
                                    });
                                } else {
                                    callback(500, {'Error' : 'Error while deleting the checks in check folder'})
                                }
                            });
                        } else {
                            callback(400, {'Error' : 'Token has benn expired'})
                        }
                    });
                } else {
                    callback(403, {'Error' : 'Missing required token in header or token is not valid'})
                }
            } else {
                callback(400, {'Error' : 'Specified ID does not exists'})
            }
        });
    } else {
        callback(400,{'Error' : 'Missing Required fields'});
    }
}



module.exports = handler;
