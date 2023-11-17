const http = require('node:http');


const server = http.createServer();

const users = [
  // try adding more fields to user - username, password, etc.
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
  // could set up router object to handle GET / POST / etc.
  if (endpoint === '/users') {
    if (method === 'GET') {
      response.end(JSON.stringify({ users }))
    }
    if (method === 'POST') {
      let body = [] // stores all of the data chunks
      // setting up 2 event listeners, one on "data", one on "end"
      // data coming in from request -> push chunk of data into body []
      // when finished sending data, will use Buffer class to concat dataStream array into string --> into body []
      // then send back response to client (Postman in this case)
      // see https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction
      request.on("data", chunk => {
          body.push(chunk);
      })
      .on("end", () => {
        // https://nodejs.org/api/buffer.html#buffer
        // Buffer objects are used to represent a fixed-length sequence of bytes.
        // .concat is a public Buffer method - can use it whenever / wherever
        body = JSON.parse(Buffer.concat(body).toString()); // body is a JS {}
        // how do we check that user doesn't already exist in users []?
        users.push(body);
        // response.end(JSON.stringify(body)); // response needs to be a string
        response.end(JSON.stringify(users)); // returning updated users array instead of just the body in line above
      })

      // response.end("You've sent a POST request!")
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
