const express = require('express')
const Sse = require('json-sse')
const bodyParser = require('body-parser')
const cors = require('cors')
const Sequelize = require('sequelize')
const db = require('./db')

//initialize the server
const app = express()

//register middleware
const jsonParser = bodyParser.json()
app.use(cors())
app.use(jsonParser)

const Messages = db.define(
  'messages',
  {
    title: { type: Sequelize.STRING }
  }
)

Messages
  .findAll()
  .then(messages => {
    const json = JSON.stringify(messages)
    const stream = new Sse(json)

    //listen for a new client
    function onStream(request, response) {
      stream.init(request, response)
    }
    app.get('/stream', onStream)

    //lister for a new messages
    function onMessage(request, response) {
      const { message } = request.body//const message = req.body.message

      console.log('message', message)
      Messages
        .create({ title: message })
        .then(message => {
          Messages
            .findAll()
            .then(messages => {

              //update the initial data
              stream.updateInit(messages) //built-id method of SSE

              //notify all the clients
              stream.send(messages)

              //send a response
              return response.status(201).send(message)
            })
            .catch(err => {
              res.status(500).json({
                message: 'Something went wrong',
                error: err
              })
            })
        })
    }
    app.post('/message', onMessage)
  })



const port = process.env.PORT || 5000

function onListen() {
  console.log(`listening on :${port}`)
}

app.listen(port, onListen)
