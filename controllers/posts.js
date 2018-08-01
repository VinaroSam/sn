'use strict'

const Post = require('../models/posts')
const services = require('../services')
const bcrypt = require('bcrypt-nodejs')
const shortid = require('shortid'),
  moment = require('moment');

//Create message
function makePost(req, res) {
  let token = req.headers.token;
  const postit = new Post({
    postid: 'puid_' + shortid.generate(),
    postOwnerUid: services.sessionUUID(token),
    postAuthor: req.body.postAuthor,
    postTitle: req.body.postTitle,
    postBody: req.body.postBody,
    postLike: req.body.postLike,
    postCreationDate: moment().toISOString()
  })

  postit.save((err) => {
    if (err) {
      console.log("in error - claim.js - return 500")
      return res.status(500).send({
        message: 'error'
      })
    }
    console.log(postit.messageid)
    console.log("not error return 201 - message success")
    return res.status(201).send({
      message: 'sucess',
      postit: postit.postid
    })
  })
}

function getAllPosts(req, res){
    Post.find({}, (err, posts) => {
        if (err) return res.status(500).json({
          message: `Error fetching the record ${err}`
        })
        if (!posts) return res.status(404).json({
          message: 'Not existent messages'
        })
        console.log(posts);
        res.status(200).json(
          posts
        )
      }).sort({postCreationDate: -1});
}

function getPostsByUser(req, res) {
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
  Post.find({
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


module.exports = {
  makePost,
  getAllPosts
}