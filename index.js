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
function handleEndpoint(endpoint, request, response) {
  const { method } = request;
  let body = [];
  request.on('error', err =>{
    console.error(err);
  })
  request.on('data', chunk =>{
    body.push(chunk);
  })
  request.on('end', () =>{
    body = Buffer.concat(body).toString();
    console.log(body);
  })
  // set up conditions for checking the route and the method
  if (endpoint === '/users') {
    if (method === 'GET') {
      response.end(JSON.stringify({ users }))
    }
  }
  if (method === "POST"){
    const data = JSON.parse(body);
    // for (const key in data){
    //   if (data[key] === ''){
    //     response.statusCode = 200;
    //     response.end("data is missing fields/n")
    //   }
    // }
    users.push(JSON.parse(body));
    response.end(JSON.stringify({users}))
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

})

server.listen(3000, undefined, undefined, () => console.log("server is listening on port 3000..."))
