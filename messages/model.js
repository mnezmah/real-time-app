const Sequelize = require('sequelize')
const db = require('../db')

const Messages = db.define(
  'messages', {
    title: { type: Sequelize.STRING}
  })

module.exports = Messages