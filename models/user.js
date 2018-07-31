'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')
const shortid = require('shortid');



const UserSchema = new Schema({
  userUid: {
    type: String,
    unique: true
  },
  // externalId: {
  //   type: String,
  //   unique: true
  // },
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  mobile: String,
  firstName: String,
  lastName: String,
  avatar: String,
  password: String,
  signupDate: {
    type: Date,
    default: Date.now()
  },
  lastLogin: Date,
  profile: String,
  dateOfBirth: String,
  title: String,
  friends: Array
})

mongoose.model('User', UserSchema);

UserSchema.methods.gravatar = function() {
  if (!this.email) return `https://gravatar.com/avatar/?s=200&d=retro`

  const md5 = crypto.createHash('md5').update(this.email).digest('hex')
  return `https://gravatar.com/avatar/${md5}?s=200&d=retro`
}

// generating a hash
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};


module.exports = mongoose.model('User', UserSchema)
