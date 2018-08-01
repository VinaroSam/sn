'use strict'

const Message = require('../models/message')
const services = require('../services')
const bcrypt = require('bcrypt-nodejs')
const shortid = require('shortid'),
  moment = require('moment');

//Create message
function createMessage(req, res) {
  let token = req.headers.token;
  const msg = new Message({
    messageid: 'muid_' + shortid.generate(),
    messageOwnerUid: services.sessionUUID(token),
    messageRecipient: req.body.messageRecipient,
    messageTitle: req.body.messageTitle,
    messageBody: req.body.messageBody,
    messageFullName: req.body.messageFullName,
    messageFrom: req.body.messageFrom,
    messageTo: req.body.messageTo,
    messageCreationDate: moment().toISOString(),
    messageStatus: 'new'
  })

  msg.save((err) => {
    if (err) {
      console.log("in error - claim.js - return 500")
      return res.status(500).send({
        message: 'error'
      })
    }
    console.log(msg.messageid)
    console.log("not error return 201 - message success")
    return res.status(201).send({
      message: 'sucess',
      msg: msg.messageid
    })
  })
}



function getMessagesByUser(req, res) {
  console.log(typeof req.headers.uid)
  console.log(services.sessionUUID(req.headers.token))
  let userUid;
  if (typeof req.headers.uid === 'undefined') {
    console.log("1")
    userUid = services.sessionUUID(req.headers.token);
  } else {
    userUid = req.headers.uid
    console.log("2")
  }
  console.log(userUid)
  Message.find({
    $or: [{
        "messageRecipient": userUid
      },
      {
        "messageSender": userUid
      }
    ]
  }, (err, messages) => {
    if (err) return res.status(500).json({
      message: `Error fetching the record ${err}`
    })
    if (!messages) return res.status(404).json({
      message: 'Not existent messages'
    })
    let nouveaux = [];
    let envoyes = [];
    let archives = [];
    messages.forEach((msg) => {
      if (msg.messageRecipient === userUid) {
        if (msg.messageStatus === 'new') {
          nouveaux.push(msg)
        } else {
          archives.push(msg)
        }
      } else {
        envoyes.push(msg)
      }
    })

    let messagesClasses = [];
    messagesClasses.push.apply(messagesClasses, [nouveaux, envoyes, archives])
    res.status(200).json(
      messagesClasses
    )
  }).sort({messageCreationDate: -1});
}

function getAllMessages(req, res) {
  let userUid = req.headers.uid;
  console.log(req.headers.uid);
  console.log(userUid);
  Message.find({
    'messageRecipient': userUid
  }, (err, messages) => {
    if (err) return res.status(500).json({
      message: `Error fetching the record ${err}`
    })
    if (!messages) return res.status(404).json({
      message: 'Not existent messages'
    })
    console.log(messages);
    res.status(200).json(
      messages
    )
  });
}

function getNewMessagesNumber(req, res) {
  let userUid = services.sessionUUID(req.headers.token);
  Message.find({
    'messageRecipient': userUid,
    'messageStatus': 'new'
  }, (err, msgs) => {
    if (err) return res.status(500).json({
      message: `Error fetching the record ${err}`
    })
    if (!msgs) return res.status(404).json({
      message: 'Not existent messages'
    })
    let number = msgs.length
    console.log('messages : ' + msgs[0])
    res.status(200).json({
      number
    })
  })
}

function updateMessage(req, res) {
  let messageId = req.params.messageId;
  console.log(messageId)
  let update = req.body;
  console.log(update)

  Message.findOneAndUpdate({
    'messageid': messageId
  }, update, (err, messageUpdated) => {
    if (err) res.status(500).json({
      message: `Error updating message: ${err}`
    })

    res.status(200).json({
      message: messageUpdated
    })
  })
}


module.exports = {
  createMessage,
  getMessagesByUser,
  getNewMessagesNumber,
  updateMessage,
  getAllMessages
}