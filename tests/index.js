/*
*Test Runner
*
*/
//Override the NODE_ENV variable
process.env.NODE_ENV = 'testing';

//Application Logic for the test runner
_app = {};

//Coontainer for test
_app.tests = {};

_app.tests.units = require('./unit');
_app.tests.api = require('./api');

//run all the tests and print the results
_app.runTests = function(){
    var errors = [];
    var successes = 0;
    var counter = 0;
    var limit = _app.countTests();
    for(var key in _app.tests){
        if(_app.tests.hasOwnProperty(key)){
            var subTest = _app.tests[key];
            for(var testName in subTest){
                if(subTest.hasOwnProperty(testName)){
                    (function(){
                        var tmpTestName = testName;
                        var testValue = subTest[testName];
                        //Call the tests

                        try{
                            testValue(function(){
                                //If it had called ack then it had succeeded and then log in green
                                console.log('\x1b[32m%s\x1b[0m', tmpTestName);
                                counter++;
                                successes++;
                                if(counter == limit){
                                    _app.produceTestReport(limit, successes, errors)
                                }
                            })
                        } catch(e){
                            //If its failed then it throws and it is logged in red
                            errors.push({
                                'testName' : tmpTestName,
                                'value' : e
                            });
                            console.log('\x1b[31m%s\x1b[0m', tmpTestName);
                            counter++;
                            if(counter == limit){
                                _app.produceTestReport(limit, successes, errors);
                            }
                        }
                    })();
                }
            }
        }
    }

}

_app.countTests = function(){
    var counter = 0;
    for(var key in _app.tests){
        if(_app.tests.hasOwnProperty(key)){
            subTests = _app.tests[key];
            for(var testName in subTests){
                if(subTests.hasOwnProperty(testName)){
                    counter++;
                }
            }
        }
    }
    return counter;
}

//Produce test outcome results of tests
_app.produceTestReport = function(limit, successes, errors){
    console.log("");
    console.log("---------------------BEGIN TESTS---------------------");
    console.log("");
    console.log("Total Tests " + limit);
    console.log("Passes "+ successes);
    console.log("Errors "+ errors.length);

    //If there is error, print them in detail
    if(errors.length > 0){
        console.log("");
        console.log("---------------------BEGIN ERROR DETAILS------------------------");
        console.log("");
        errors.forEach(function(testError){
            console.log("\x1b[31m%s\x1b[0m", testError.testName);
            console.log(testError.value);
            console.log("");
        });
        console.log("----------------------END OF ERROR DETAILS------------------------");
        console.log("");
    }
    console.log("");
    console.log("-------------------END OF TESTS--------------------------");
    process.exit(0);
}

//run the test
_app.runTests();