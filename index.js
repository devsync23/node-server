const http = require('node:http');

const server = http.createServer();

const users = [
  { id: 1, name: "JB", age: 30 }
]
const routes = [
  '/users',
  '/signup'
]
// request handler
// .on( eventName: string, callback function )
server.on('request', (request, response) => {

  const endpoint = request.url;
  if (routes.includes(endpoint)) {
    response.json({ users })
  } else {
    response.statusCode(404)
  }

  // handle the response to the client
  response.end();
})

server.listen(3000, undefined, undefined, () => console.log("server is listening on port 3000..."))