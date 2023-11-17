// setting up node library for server setup
const http = require('node:http');
const server = http.createServer();

// Creating users variable "database"
const users = [
  {
    name: "JB",
    email: "JB@JB.com",
    phoneNumber: 3102223242,
    password: "asdfasda",
    bio: "asdasdasd",
    age: 30,
    verified: false
  }
]

// function should accept a user object input
// if the user object has an email value that maches an existing user
// return
function isExistingUser(inputUser,UsersLibrary) {
  let output = false;
  UsersLibrary.forEach((user) =>{
    if(user.email === inputUser.email){
      output = true;
    }
  })
  return output;
}

// Creating url routes/ endpoint for http request
const routes = [
  '/users',
  '/signup'
]

// Router Concept that stores all the request method functions in it as a OOP approach
const Router = {
  '/users': {
    'GET': (users,request,response) => { response.end(`Current Users Library:\n${JSON.stringify({ users })}`) },
    'POST': (users,request,response) =>{
      let body = [];
      let errorMessage = '';
      // Request Body serialization processing code
      request.on('error', err =>{
        console.error(err);
      })
      request.on('data', chunk =>{
        body.push(chunk);
      })
      // you can only access the body of the request within this request.on('end') scope
      request.on('end', () =>{
        body = Buffer.concat(body).toString();
        let data = JSON.parse(body);
        // if there is empty entry in the request body data, set statusCode
        for (const key in data){
          if (data[key] === ''){
            response.statusCode = 400;
            errorMessage = 'Description: data has empty fields';
          }
        }
        if(isExistingUser(data,users)){
          response.statusCode = 400;
          errorMessage = 'Existing User in the database';
        }
        // checking statusCode and provide response accordingly
        // if statusCode is not badRequest, then proceed with adding new user to
        // our existing users library
        if(response.statusCode!== 400){
          users.push(JSON.parse(body));
          response.end(`Current Users Library:\n${JSON.stringify({users})}`)
        }
        // if statusCode is badRequest, DO NOT add new user and provide response
        // with error message
        else{
          response.end(`Response status code: ${response.statusCode}\n${errorMessage}\nCurrent Users Library:\n${JSON.stringify({users})}`)
        }
      })
    }
  }
}

// server.on( eventName: string, callback function )
// Creating Server handler
server.on('request', (request, response) => {
  const endpoint = request.url;
    if (routes.includes(endpoint)) {
      // if the route is valid, pass it to the `handleEndpoint` function, along with the request and response objects
      // handleEndpoint(endpoint, request, response) is the lower level mechanism of handling the request
      Router[endpoint][request.method](users,request,response);
    } else {
      // if endpoint doesn't match our routes, return error
      response.statusCode = 404;
      response.end("Could not find route")
    }
})

// Setting up server event listener, running server continously
server.listen(3000, undefined, undefined, () => console.log("server is listening on port 3000..."))
// Naming Convention:
// usually runs on port 3000 or 3001
// clients side run on port 88 or 8000
