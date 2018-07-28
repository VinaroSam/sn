'use strict'

const express = require('express'),
  bodyParser = require('body-parser');

const userCtrl = require('../controllers/user'),
  
 
  msgCtrl = require('../controllers/messages'),
 
  //  ticketCtrl = require('../controllers/claim'),
  auth = require('../middlewares/auth');

const api = express.Router(),
  jsonParser = bodyParser.json();

// users
api.post('/signup', userCtrl.signUp)
api.post('/signin', userCtrl.signIn)

//mailbox
api.get('/mails', msgCtrl.getMessagesByUser);
api.get('/mailsback', msgCtrl.getAllMessagesForBackend);
api.get('/mailnumber', msgCtrl.getNewMessagesNumber);
api.post('/postmail', msgCtrl.makeMessage);
api.put('/mail/:messageId', auth, msgCtrl.updateMessage);

// get all users
api.get('/user', auth, userCtrl.getUsers)
api.get('/user/:userUid', auth, userCtrl.getUser)

api.get('/private', auth, (req, res) => {
  res.status(200).send({
    message: 'You have access now'
  })
})

module.exports = api