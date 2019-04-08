/*
*This is an example that throws something when init function is called
*
*/

//Container for the module
var example = {};

//init function
example.init = function(){
    //Bar is not defined so its going to throws a reference error
    var foo = bar;
}

module.exports = example;