'use strict'

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const app = require('./app')
const config = require('./config')

mongoose.connect(config.db, { useMongoClient: true }, (err, res) => {
  if (err) {
    return console.log(`Error connection to DB: ${err}`)
  }
  console.log('Connection to DB established')

  app.listen(config.port, () => {
    console.log(`API REST running at http://localhost:${config.port}`)
  })
})
