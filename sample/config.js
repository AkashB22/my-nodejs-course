//create environment object

var environments = {};

//add ports and environment properties

//staging (default) environment
environments.staging = {
    'port' : '3000',
    'envName' :'staging',
};

//production environment
environments.production = {
    'port' : '5000',
    'envName' : 'production',
};

//check for the NODE_ENV in command line argument

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//call the environments object based in the current environment or call staging as a default environment
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] :environments.staging;

module.exports = environmentToExport;