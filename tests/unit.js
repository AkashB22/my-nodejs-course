/*
* this is an unit test
*
*/

//Dependencies
var _helpers = require('./../lib/helpers');
var assert = require('assert');
var _logs = require('./../lib/logs');
var exampleDebugging = require('./../lib/exampleDebuggingProblem');

//Holder for tests
var units = {};

units['helper.getANumber return a number'] = function(done){
    var val = _helpers.getANumber();
    assert.equal(typeof(val), 'number');
    done();    
}

units['helper.getANumber return 1'] = function(done){
    var val = _helpers.getANumber();
    assert.equal(val, 1);
    done();    
}

units['helper.getANumber return 2'] = function(done){
    var val = _helpers.getANumber();
    assert.equal(val, 2);
    done();    
}

//Test for logs.list should callback an array and a false error
units['logs.list should callback an array and a false error'] = function(done){
    _logs.list(true, function(err, logFileNames){
        assert.equal(err, false);
        assert.ok(logFileNames instanceof Array);
        assert.ok(logFileNames.length > 1);
        done();
    });
}

//logs.truncate should not throw if the logId does not exist
units['logs truncate should not throw if there is no logId, it should callback an error instead'] = function(done){
    assert.doesNotThrow(function(){
        _logs.truncate('i do not exists', function(err){
            assert.ok(err);
            done();
        });
    }, TypeError);
}


//ExampleDebugging problem throws an error
units['exampleDebuggingProblem that should not throw an error'] = function(done){
    assert.doesNotThrow(function(){
        exampleDebugging.init();
        done();
    }, TypeError);
}

module.exports = units;