'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema



const MessageSchema = Schema({
  messageid: String,
  messageOwnerUid: String,
  messageUri: String,
  messageSender: String,
  messageRecipient: String,
  messageTitle: String,
  messageBody: String,
  messageCreationDate: String,
  messageStatus: String,
})



// docUrlid document unique resource location identifier.
// docOwnerCat : Enterprise / Person
mongoose.model('Message', MessageSchema);

module.exports = mongoose.model('Message', MessageSchema)