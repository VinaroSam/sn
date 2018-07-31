'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = Schema({
  messageid: String,
  messageOwnerUid: String,
  messageUri: String,
  messageSender: String,
  messageFrom: String,
  messageRecipient: String,
  messageTo: String,
  messageTitle: String,
  messageBody: String,
  messageFullName: String,
  messageCreationDate: String,
  messageStatus: String
})

mongoose.model('Message', MessageSchema);

module.exports = mongoose.model('Message', MessageSchema)