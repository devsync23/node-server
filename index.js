const http = require('node:http');
const qs = require('node:querystring')
const server = http.createServer();

const users = [
  { id: 1, name: "JB", age: 30 }
]
const routes = [
  '/users',
  '/signup'
]

// request handler
function handleEndpoint(endpoint, request, response) {
  const { method } = request;
  // set up conditions for checking the route and the method
  if (endpoint === '/users') {
    if (method === 'GET') {
     response.end(JSON.stringify({ users }))
    }
    if (method === 'POST') {
    let body = []
    request
      .on('data', chunk => body.push(chunk))
      .on('end', () => {
        body = JSON.parse(Buffer.concat(body).toString())
        users.push(body)
        response.end(JSON.stringify(users))
      })
  }
  }
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
