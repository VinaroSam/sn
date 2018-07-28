'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = Schema({
  userUI : String,
  profileId : String,
  description: String
})

module.exports = mongoose.model('Profile', ProfileSchema)


//collection of relations from profiles and user id
//