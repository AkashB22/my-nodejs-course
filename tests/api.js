/*
*
*API TEST RUNNERS
*
*/

//Dependencies
var app = require('./../index');
var assert = require('assert');
var config = require('./../lib/confighttps');
var _helpers = require('./../lib/helpers');

//holder
var api = {};

//The main init function should be able to run without throwing
api['app.init should start without throwing'] = function(done){
    assert.doesNotThrow(function(){
        app.init(function(err){
            done();
        });
    }, TypeError);
}

//Make a request to ping
api['Request to ping api and got 200 as response'] = function(done){
    _helpers.apiTestForGetReq('/ping', function(res){
        var val = res.statusCode;
        assert.equal(val, 200);
        done();
    });
}

//Make a request to api/user and get 400 as response
api['Request to /api/user and get 400 as response'] = function(done){
    _helpers.apiTestForGetReq('/api/user', function(res){
        assert.equal(res.statusCode, 400);
        done();
    });
}

//Make a request to a random path and get 404 as response
api['Request to a random path and get 404 as response'] = function(done){
    _helpers.apiTestForGetReq('/path/doesnt/exists', function(res){
        assert.equal(res.statusCode, 404);
        done();
    });
}

module.exports = api;