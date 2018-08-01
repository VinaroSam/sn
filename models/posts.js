'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = Schema({
  postid: String,
  postOwnerUid: String,
  postAuthor: String,
  postTitle: String,
  postBody: String,
  postCreationDate: String,
  postStatus: String
})

// mongoose.model('Message', MessageSchema);

module.exports = mongoose.model('Post', PostSchema)