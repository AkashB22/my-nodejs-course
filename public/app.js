/*
*
*Frontend logic for application
*
*/

//this is the container for frontEnd application
var app = {};

//config
app.config = {
    'sessionToken' : false,
};

//AJAX client for the Restful api
app.client = {};

//interface for making API calls
app.client.request = function(headers, path, method, queryStringObject, payload, callback){
    //Set defaults
    headers = typeof(headers) == 'object' && headers !== null ? headers : {};
    path = typeof(path) == 'string' && path.length > 0 ? path : '';
    method = typeof(method) == 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(method) > -1 ? method.toUpperCase() : 'GET';
    queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
    payload = typeof(payload) == 'object' && payload !== null ? payload : {};
    callback = typeof(callback) == 'function' ? callback : false;

    // For Each queryStringObject parameter sent add to the path
    var requestUrl = path + '?';
    var counter = 0;
    for(var queryKey in queryStringObject){
        if(queryStringObject.hasOwnProperty(queryKey)){
            counter++;
            if(counter > 1){
                requestUrl+='&';
            }
            //Add the key value to the url
            requestUrl+=queryKey + '=' + queryStringObject[queryKey];
        }
    };

    //Form the http request as JSON type
    var xhr = new XMLHttpRequest();
    xhr.open(method, requestUrl, true);
    xhr.setRequestHeader('Content-type', 'application/json');

    //For each additional header sent, add into the request
    for(var headerKey in headers){
        if(headers.hasOwnProperty(headerKey)){
            xhr.setRequestHeader(headerKey, headers[headerKey]);
        }
    };

    //if there is a current session token set in app.config, we need to add that to headers
    if(app.config.sessionToken){
        xhr.setRequestHeader('tokenid', app.config.sessionToken.tokenId);
    }

    //when we get the request back, handle the response
    xhr.onreadystatechange = function(){
        if(xhr.readyState == XMLHttpRequest.DONE){
            var statusCode = xhr.status;
            var responseReturned = xhr.responseText;
            
            //Callback the response if we have a callback requested
            if(callback){
                try{
                    var parsedResponse = JSON.parse(responseReturned);
                    callback(statusCode, parsedResponse);
                }
                catch(e){
                    callback(statusCode, false);
                }
            }
        }
    }

    //Send the payload as JSON for request
    var payloadString = JSON.stringify(payload);
    xhr.send(payloadString);

};

//bind the Logout button
app.bindLogoutButton = function(){
    document.getElementById("logOutButton").addEventListener('click', function(e){
        //Prevent the default function from redirecting to anywhere else
        e.preventDefault();

        //call the logOutUser to log the user out
        app.logUserOut();
    });
};

//Log the user out and then redirect them
app.logUserOut = function(){
    //set redirectUser to default to true
    redirectUser = typeof(redirectUser) == 'boolean' ? redirectUser : true;

    //Get the token to delete
    var tokenId = typeof(app.config.sessionToken.tokenId) == 'string' ? app.config.sessionToken.tokenId : '';
    //form the queryString with the token
    var queryStringObject = {
        'tokenId' : tokenId,
    }
    if(tokenId){
        //client request api to delete the token
        app.client.request(undefined,'api/token', 'DELETE', queryStringObject, undefined, function(err, responsePayload){
        //set the app.config token as false
        app.setSessionToken(false);

        //Send the user to logged out page
        if(redirectUser){
           window.location = '/session/deleted';
        }
       });
    };
};

//Bind the forms
app.bindForms = function(){
    if(document.querySelector("form")){
        var allForms = document.querySelectorAll("form");
        for(var i=0; i< allForms.length; i++){
            allForms[i].addEventListener("submit", function(e){
                //stop the default posting form
                e.preventDefault();
                var formId = this.id;
                var method = this.method.toUpperCase();
                var path = this.action;
        
                //Hide the Error message if its currently shown by previous errors
                document.querySelector("#" + formId +" .formError").style.display = "none";

                //Hide the success message if its currently shown due to previous error
                if(document.querySelector("#" + formId + " .formError")){
                    document.querySelector("#" + formId + " .formError").style.display = "none";
                }

                //turn the input into a payload
                var payload = {};
                var elements = this.elements;
                for(var i=0;i<elements.length;i++){
                    if(elements[i].type !== 'submit'){
                        // Determine class of the element and set value accordingly
                        var classOfElement = typeof(elements[i].classList.value)=='string' && elements[i].classList.value.length > 0 ? elements[i].classList.value : '';
                        var valueOfElement = elements[i].type == 'checkbox' && classOfElement.indexOf('multiselect') == -1 ? elements[i].checked : classOfElement.indexOf('intval') == -1 ? elements[i].value : parseInt(elements[i].value);
                        var elementIsChecked = elements[i].checked;
                        //Override the method with _method's value if it that a input name _method
                        var nameOfElement = elements[i].name
                        if(nameOfElement == '_method'){
                            method = valueOfElement;
                        } else{
                            //Create a payload field named as "method" if elements name is actually httpmethod
                            if(nameOfElement == 'httpmethod'){
                                nameOfElement = 'method';
                            }

                            //Create an payload field name "id" if the element name is actually uid 
                            if(nameOfElement == 'uid'){
                                nameOfElement = 'id';
                            }
                            //If the element has a class as multiselect add its value(s) as array elements
                            if(classOfElement.indexOf('multiselect') > -1){
                                if(elementIsChecked){
                                    payload[nameOfElement]= typeof(payload[nameOfElement]) == 'object' && payload[nameOfElement] instanceof Array ? payload[nameOfElement] : [];
                                    payload[nameOfElement].push(valueOfElement);
                                }
                            } else{
                                payload[nameOfElement] = valueOfElement;
                            }
                        }
                    }
                }
                
                //If we have delete method we put payload to queryString
                var querySringObject = method == 'DELETE' ? payload : [];

                //Call the api
                app.client.request(undefined, path, method, querySringObject, payload, function(statusCode, responsePayload){
                    //Check to set the form error
                    if(statusCode !== 200){
                        
                        if(statusCode == 403){
                            //log the user out
                            app.logUserOut();
                        } else{
                            //set the error value based on payload or set it to some default error message
                        var error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : "Error occur while process";
        
                        //get the error to formError div
                        document.querySelector("#"+formId+" .formError").innerHTML = error;
        
                        //show/unhide the block
                        document.querySelector("#"+formId+" .formError").style.display = 'block';
                        }
                    } else {
                        //If successful, send to form response processor
                        app.formResponseProcessor(formId, payload, responsePayload);
                    }
                });
            });
        }
    }
};

app.formResponseProcessor = function(formId, requestPayload, responsePayload){
    var functionToCall = false;
    //If account Creation was successful try to logg\in the user immediately
    if(formId == 'accountCreate'){
        //@TODO Do something to show that the account is created successfully
        console.log("form has been submitted and the account is created");

        var payload = {
            'phone' : requestPayload.phone,
            'password' : requestPayload.password
        }

        //POST data to create token
        app.client.request(undefined, 'api/token', 'POST', undefined, payload, function(statusCode, responsePayload){
            if(statusCode !== 200){
                //Set the formError
                document.querySelector("#"+formId+".formError").innerHTML = "Sorry an error occured on login. please try again";
                //show/unhide the formError
                document.querySelector("#"+formId+".formError").style.display = "block";
            } else {
                app.setSessionToken(responsePayload);
                window.location = '/checks/all';
            }
        });
    }
    if(formId == 'sessionCreate'){
        app.setSessionToken(responsePayload);
        window.location = '/checks/all'
    }

    //If form successfully and they have success message , show them
    var formWithSuccessMsg = ['accountEdit1', 'accountEdit2', 'checksEdit1'];
    if(formWithSuccessMsg.indexOf(formId) > -1){
        document.querySelector("#"+ formId + " .formSuccess").style.display = "block";
    }

    //If the user deleted his account redirect it to account delete page
    if(formId == 'accountEdit3'){
        app.logUserOut(false);
        window.location = '/account/deleted';
    }

    //If the user created a new check then redirect him to dashboard
    if(formId == 'checksCreate'){
        window.location = '/checks/all';
    }

    //If the user deleted a check, redirect them to the dashboard
    if(formId == 'checkEdit2'){
        window.location = 'checks/all';
    }

};

//get the token from local storage and set it to the app.config object
app.getSessionToken = function(){
    var tokenString = localStorage.getItem('token');
    if(typeof(tokenString) == 'string'){
        try{
            var token = JSON.parse(tokenString);
            app.config.sessionToken = token;
            if(typeof(token) == 'object'){
                app.setLoggedInClass(true);   
            } else {
                app.setLoggedInClass(false);
            }
        } catch(e){
            app.config.sessionToken = false;
            app.setLoggedInClass(false);
        }
    }
};

//Set or remove the logged in class from the body
app.setLoggedInClass = function(add){
    var target = document.querySelector("body");
    if(add){
        target.classList.add("loggedIn");
    } else {
        target.classList.remove("loggedIn");
    }
};

//Set the session token in app.config and as well as the localStorage
app.setSessionToken = function(token){
    app.config.sessionToken = token;
    var tokenString = JSON.stringify(token);
    localStorage.setItem('token', tokenString);
    if(typeof(token) == 'object'){
        app.setLoggedInClass(true);
    } else {
        app.setLoggedInClass(false);
    }
};

//renew the token
app.renewToken = function(callback){
    var currentToken = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : {};
    if(currentToken){
        // update the token with new expiration
        var payload = {
            'tokenId' : currentToken.tokenId,
            'extend' : true,
        };
        app.client.request(undefined, 'api/token', 'PUT', undefined, payload, function(statusCode, responsePayload){
            //Display the error on the form if needed
            if(statusCode == 200){
                var queryStringObject = {'tokenId' : currentToken.tokenId};
                app.client.request(undefined,'api/token','GET', queryStringObject, undefined, function(statusCode, responsePayload){
                    //Display the error on the form if needed
                    if(statusCode == 200){
                        app.setSessionToken(responsePayload);
                        callback(false);
                    } else {
                        app.setSessionToken(false);
                        callback(true);
                    }
                });
            } else {
                app.setSessionToken(false);
                callback(true);
            }
        });
    } else {
        app.setSessionToken(false);
        callback(true);
    }
};

//Load data on page
app.loadDataOnPage =function(){
    //Get the current page from the body class
    var bodyClasses = document.querySelector("body").classList;
    var primaryClass = typeof(bodyClasses[0]) == 'string' ? bodyClasses[0] : false

    //logic for the account settings page
    if(primaryClass == 'accountEdit'){
        app.loadAccountEditPage();
    }

    //logic for dashboard page
    if(primaryClass == 'checkLists'){
        app.loadChecklistsPage();
    }

    //Logic for check details page
    if(primaryClass == 'checkEdit'){
        app.loadChecksEditPage();
    }
};

//Load the account edit page specifically
app.loadAccountEditPage = function(){
    // Get the phone number from current token, or log the user out if none is there
    var phone = typeof(app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;
        if(phone){
        //Fetch the user data
        var queryStringObject = {
            'phone': phone,
        }
        
        
        app.client.request(undefined, 'api/user', 'GET', queryStringObject, undefined, function(statusCode, responsePayload){
            if(statusCode == 200){
                //Put the data into form as the values where needed
                document.querySelector("#accountEdit1 .firstNameInput").value = responsePayload.firstName;
                document.querySelector("#accountEdit1 .lastNameInput").value = responsePayload.lastName;
                document.querySelector("#accountEdit1 .displayPhoneInput").value = responsePayload.phone;
                
                //Put the hidden phone fields into both forms
                var hiddenPhoneInputs = document.querySelectorAll("input.hiddenPhoneNumberInput");
                for(var i=0; i<hiddenPhoneInputs.length; i++){
                    hiddenPhoneInputs[i].value = responsePayload.phone;
                }
            } else{
                app.logUserOut();
            }
        });
    } else{
        app.logUserOut();
    }
}

//Load dashboard page specifically
app.loadChecklistsPage = function(){
    // Get the phone number from the browser localStorage current token or log the user out
    var phone = typeof(app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;
    
    if(phone){
        //fetch user data
        var queryStringObject = {
            'phone' : phone
        };
    
        app.client.request(undefined, 'api/user', 'GET', queryStringObject, undefined, function(statusCode, responsePayload){
            if(statusCode == '200'){
                //Determine how many checks user has 
                var allChecks = typeof(responsePayload.checks) == 'object' && responsePayload.checks instanceof Array ? responsePayload.checks : [];
                if(allChecks.length > 0){
                    //Show each created checks as a new row in the table
                    allChecks.forEach(function(checkId){
                        //Get the data for the checks
                        var queryStringObject = {
                            'id' : checkId
                        };
                        app.client.request(undefined, 'api/check', 'GET', queryStringObject, undefined, function(statusCode, responsePayload){
                            if(statusCode == 200){
                                var checkData = responsePayload;
                                // Make the checkData into the table
                                var table = document.getElementById('checksListTable');
                                var tr = table.insertRow(-1);
                                tr.classList.add('checkRow');
                                var td0 = tr.insertCell(0);
                                var td1 = tr.insertCell(1);
                                var td2 = tr.insertCell(2);
                                var td3 = tr.insertCell(3);
                                var td4 = tr.insertCell(4);
                                td0.innerHTML = responsePayload.method.toUpperCase();
                                td1.innerHTML = responsePayload.protocol+'://';
                                td2.innerHTML = responsePayload.url;
                                var state = typeof(responsePayload.state) == 'string' ? responsePayload.state : 'unknown';
                                td3.innerHTML = state;
                                td4.innerHTML = '<a href="/checks/edit?id='+responsePayload.id+'">View/ Edit/ Delete</a>';
                            } else{
                                console.log('Error trying to load checkID', checkId);
                            }
                        });
                    });
                
                if(allChecks.length < 5){
                    // Show the createCheck cta
                    document.getElementById('createCheckCTA').style.display = 'block';
                } 
            }else{
                    //Show you have no  checks
                    document.getElementById("noChecksMessage").style.display = 'table-row';

                    //show the createcheck cta
                    document.getElementById("createCheckCTA").style.display = 'block';
                }
            } else{
                app.logUserOut();
            }
        });
    } else{
        app.logUserOut();
    }
};

// Load the checks edit page seperately
app.loadChecksEditPage = function(){
    //Get the id from query String, if none is found redirect back to dashboard
    var id = typeof(window.location.href.split('=')[1]) == 'string' && window.location.href.split('=')[1].length > 0 ? window.location.href.split('=')[1] : false;
    if(id){
        //fetch the data 
        var queryStringObject = {
            'id' : id
        };
        app.client.request(undefined, 'api/check', 'GET', queryStringObject, undefined, function(status, responsePayload){
            if(status == 200){
                //Put the hidden id input to both the forms
                var hiddenIdInputs = document.querySelectorAll("input.hiddenIdInput");
                for(var i in hiddenIdInputs){
                    hiddenIdInputs[i].value = responsePayload.id;
                }

                //Put the data into the top form as values where needed
                document.querySelector("#checkEdit1 .displayIdInput").value = responsePayload.id;
                document.querySelector("#checkEdit1 .displayStateInput").value = responsePayload.state;
                document.querySelector("#checkEdit1 .protocolInput").value = responsePayload.protocol;
                document.querySelector("#checkEdit1 .urlInput").value = responsePayload.url;
                document.querySelector("#checkEdit1 .methodInput").value = responsePayload.method;
                document.querySelector("#checkEdit1 .timeOutInput").value = responsePayload.timeOutSeconds;
                var successCodeCheckboxes = document.querySelectorAll("#checkEdit1 input.successCodesInput");
                for(var i in successCodeCheckboxes){
                    if(responsePayload.successCodes.indexOf(parseInt(successCodeCheckboxes[i].value)) > -1){
                        successCodeCheckboxes[i].checked = true;
                    }
                }
            } else{
                window.location = 'checks/all';
            }
        });
    } else{
        window.location = '/checks/all'
    }
};

//Loop to renew token often
app.tokenRenewalLoop = function(){
var body = document.querySelector('body');
if(body.classList.contains('loggedIn')){
    setInterval(function(){
        app.renewToken(function(err){
            if(!err){
                console.log("token renew was successfull @ "+ Date.now());
            } 
        });
        }, 1000 * 60);
} else{
    console.log('Still not yet loaded in');
}
} ;

//init (bootstrapping)
app.init = function(){
    //call the bind forms function
    app.bindForms();

    //bind logout logout button
    app.bindLogoutButton();

    //get the session from local storage
    app.getSessionToken();

    //Renew token
    app.tokenRenewalLoop();

    //Load data on page
    app.loadDataOnPage();
};

window.onload = function(){
    //call app init
    app.init();
};