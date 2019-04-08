//create environment object

var environments = {};

//add ports and environment properties

//staging (default) environment
environments.staging = {
    'httpPort' : '3000',
    'httpsPort' : '3001',
    'envName' :'staging',
    'hashingSecret' : 'thisIsASecret',
    'maxChecks' : 5,
    'twilio' : {
        'accountSid' : 'AC04895a1df4a4f4890533af2c1372dc2e',
        'authToken' : 'e3425d49d41b8d517df7dd3606bf3802',
        'fromPhone' : '+15407014405'
    },
    'templateGlobals' : {
        'appName' : 'upTimeChecker',
        'companyName' : 'notARealCompany Inc',
        'yearCreated' : '2018',
        'baseUrl' : 'http://localhost:3000/' 
    }
};

//staging (default) environment
environments.testing = {
    'httpPort' : '4000',
    'httpsPort' : '4001',
    'envName' :'testing',
    'hashingSecret' : 'thisIsASecret',
    'maxChecks' : 5,
    'twilio' : {
        'accountSid' : 'AC04895a1df4a4f4890533af2c1372dc2e',
        'authToken' : 'e3425d49d41b8d517df7dd3606bf3802',
        'fromPhone' : '+15407014405'
    },
    'templateGlobals' : {
        'appName' : 'upTimeChecker',
        'companyName' : 'notARealCompany Inc',
        'yearCreated' : '2018',
        'baseUrl' : 'http://localhost:4000/' 
    }
};

//production environment
environments.production = {
    'httpPort' : '5000',
    'httpsPort' : '5001',
    'envName' : 'production',
    'hashingSecret' : 'thisIsAnotherSecret',
    'maxChecks' : 5,
    'twilio' : {
        'accountSid' : 'AC04895a1df4a4f4890533af2c1372dc2e',
        'authToken' : 'e3425d49d41b8d517df7dd3606bf3802',
        'fromPhone' : '+15407014405'
    },
    'templateGlobals' : {
        'appName' : 'upTimeChecker',
        'companyName' : 'notARealCompany Inc',
        'yearCreated' : '2018',
        'baseUrl' : 'http://localhost:5000/' 
    }
};

//check for the NODE_ENV in command line argument

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//call the environments object based in the current environment or call staging as a default environment
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] :environments.staging;

module.exports = environmentToExport;