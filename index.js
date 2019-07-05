const express = require('express')
const Sse = require('json-sse')
const bodyParser = require('body-parser')
const cors = require('cors')

//initialize the server
const app = express()

//register middleware
const jsonParser = bodyParser.json()
app.use(cors())
app.use(jsonParser)

const messages = [
  'hello',
  'can you see this?'
]

//serialize the data
const json = JSON.stringify(messages)
const stream = new Sse(json)   //creates an eventSource


//listen for a new client
function onStream(request, response) {
  stream.init(request, response)
}
app.get('/stream', onStream)

//lister for a new messages
function onMessage (request, response){
  const { message } = request.body//const message = req.body.message

  //add the message to dataStore
  messages.push(message)

  //reserialize the store (stringify)
  const json = JSON.stringify(messages)

  //update the initial data
  stream.updateInit(json) //built-id method of SSE

  //notify all the clients
  stream.send(json)

  //send a response
  return response.status(201).send(message)

}
app.post('/message', onMessage)

const port = process.env.PORT || 5000 

function onListen() {
  console.log(`listening on :${port}`)
}

app.listen(port, onListen)