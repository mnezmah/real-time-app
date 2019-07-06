const { Router } = require('express')
const Messages = require('./model')

const router = new Router()

router.get('/stream', function (req, res, next) {
  Messages
    .findAll()
    .then(message => {
      res.json({ message })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err
      })
    })
})

router.post(
  '/messages', fucntion(req, res) {

    const message = {
      title: ""
    }
    res.json()
  }
)


module.exports = router