const http = require('node:http');


const server = http.createServer();

const usersLibrary = [
  {
    name: "string",
    email: "string@.string.com",
    phoneNumber: 12345678910,
    password: "stringpassword",
    bio: "stringing along",
    age: 15,
    verified: false,
  }
]

const routes = [
  '/users',
  '/signup'
]

function checkForExistingUser(user,usersLibrary) {
  if (Object.values(users).includes(user.email)) {
    response.end(`Email already exists`)
  } else {
    users.push(JSON.parse(body))
    response.end(JSON.stringify({ users }))
  }
}

// request handler
function handleEndpoint(endpoint, request, response) {
  const { method } = request;
  // set up conditions for checking the route and the method
  let body = [];
  request.on('error', err => {
    console.error(err);
  })
  request.on('data', chunk => {
    body.push(chunk);
  })
  // you can only access the body of the request within this request.on('end') scope
  request.on('end', () => {
    body = Buffer.concat(body).toString();

    if (endpoint === '/users') {
      if (method === 'GET') {
        response.end(JSON.stringify({ users }))
      } else if (method === 'POST') {
        let data = JSON.parse(body);
        checkForExistingUser(data)
        for (const key in data) {
          if (data[key] === '') {
            response.statusCode = 400;
          }
        }
        if (response.statusCode !== 400) {
          users.push(JSON.parse(body))
          response.end(JSON.stringify({ users }))
        } else {
          response.end(`Response status code: ${response.statusCode}\nDescription: data is missing fields\n${JSON.stringify({ users })} `)
        }
      }
    }
  })
}

// .on( eventName: string, callback function )
server.on('request', (request, response) => {

  const endpoint = request.url;
  if (routes.includes(endpoint)) {
    // if the route is valid, pass it to the `handleEndpoint` function, along with the request and response objects
    handleEndpoint(endpoint, request, response)
  } else {
    response.statusCode = 404;
    response.end("Could not find route")
  }

  // handle the response to the client
  // response.end();
})

server.listen(3000, undefined, undefined, () => console.log("server is listening on port 3000..."))