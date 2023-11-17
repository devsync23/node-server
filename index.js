const http = require('node:http');
const qs = require('node:querystring');


const server = http.createServer();

const users = [
  { id: 1, name: "JB", age: 30 }
]

const routes = [
  '/users',
  '/signup'
]


// request handlerdsad
function handleEndpoint(request, response) {
  const { url, method } = request;

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
    handleEndpoint(request, response)
  } else {
    response.statusCode = 404;
    response.end("Could not find route")
  }

  // handle the response to the client
  // response.end();
})

server.listen(3000, undefined, undefined, () => console.log("server is listening on port 3000..."))