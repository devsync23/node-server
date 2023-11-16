// setting up node library for server setup
const http = require('node:http');
const server = http.createServer();

// interface User {
//   name: string;
//   email: string;
//   password: string;
//   bio: string;
//   age: number;
//   verified: boolean;
// }

// Creating users variable "database"
const users = [
  { id: 1, name: "JB", age: 30 }
]
// Creating url routes/ endpoint for http request
const routes = [
  '/users',
  '/signup'
]

// BONUS CONCEPT
// const Router = {
//   '/users': {
//     'GET': () =>{},
//     'POST': () =>{}
//   }
// }

// Request handler Function
function handleEndpoint(endpoint, request, response) {
  const { method } = request;
  // Handling serialization data and accessing request body data
  let body = [];
  request.on('error', err =>{
    console.error(err);
  })
  request.on('data', chunk =>{
    body.push(chunk);
  })
  // you can only access the body of the request within this request.on('end') scope
  request.on('end', () =>{
    body = Buffer.concat(body).toString();

  // check for endpoint and method
    if (endpoint === '/users') {
      // sending back response with existing users data
      if (method === 'GET') {
        response.end(JSON.stringify({ users }))
      }
      //  pushing POST data into our exisiting user library
      if (method === "POST"){
        // parsing the JSON body data at line 36 to actual js data
        let data = JSON.parse(body);
        // checking if there is empty entry to the request body data
        for (const key in data){
          if (data[key] === ''){
            // if there is empty entry in the request body data, set statusCode
            response.statusCode = 400;
          }
        }
        // checking statusCode and provide response accordingly
        // if statusCode is not badRequest, then proceed with adding new user to
        // our existing users library
        if(response.statusCode!== 400){
          users.push(JSON.parse(body));
          response.end(JSON.stringify({users}))
        }
        // if statusCode is badRequest, DO NOT add new user and provide response
        // with
        else{
          response.end(`Response status code: ${response.statusCode}\nDescription:data is missing fields\n${JSON.stringify({users})}`
          )
        }
      }
    }
  })
}

// server.on( eventName: string, callback function )
// Creating Server handler
server.on('request', (request, response) => {
  const endpoint = request.url;
    if (routes.includes(endpoint)) {
      // if the route is valid, pass it to the `handleEndpoint` function, along with the request and response objects
      handleEndpoint(endpoint, request, response)
    } else {
      // if endpoint doesn't match our routes, return error
      response.statusCode = 404;
      response.end("Could not find route")
    }

})

// Setting up server event listener, running server continously
server.listen(3000, undefined, undefined, () => console.log("server is listening on port 3000..."))
