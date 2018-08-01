'use strict'

const User = require('../models/user')
const service = require('../services')
const bcrypt = require('bcrypt-nodejs')
const shortid = require('shortid');
const moment = require('moment');

moment.locale('fr');


//Create user
function signUp(req, res) {
  const user = new User({
    userUid: 'uuid_' + shortid.generate(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password,
    profile: req.body.profile,
    dateOfBirth: moment(req.body.dateOfBirth).local().format('Do MMMM YYYY'),
    title: req.body.title
  })

  console.log(user);
  console.log(req.body.profile);

  let hash = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);

  user.password = hash;

  user.save((err) => {
    if (err) {
      console.log("in error - user.js - return 500")
      return res.status(500).send({
        message: 'error'
      })
    }

    console.log("not error return 201 - message success")
    return res.status(201).send({
      message: 'sucess'
    })
  })
}

function signIn(req, res) {

  //console.log(req.body);

  User.findOne({
    email: req.body.email
  }, (err, user) => {

    //console.log(user);

    if (err) return res.status(500).send({
      message: err
    })
    if (!user) {
      return res.status(404).send({
        message: 'Non existent user'
      })
    } else if (user) {
      //console.log(req.body.password);

      ///comparing passwords


      bcrypt.compare(req.body.password, user.password, function(err, result) {
        if (!result) {
          // Passwords match
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        } else {
          // Passwords don't match
          res.status(200).send({
            message: 'Login successfull',
            token: service.createToken(user)
          })
        }
      })
    }
  })
}


function getUsers(req, res) {
  User.find({}, (err, users) => {
    if (err) return res.status(500).send({
      message: `Error al realizar la petición: ${err}`
    })
    if (!users) return res.status(404).send({
      message: 'No existen usuarios'
    })

    res.status(200).send({
      users
    })
  })
}

function getUser(req, res) {
  let userUid = req.params.userUid;

  //console.log(userUid);

  User.aggregate([{
      $match: {
        'userUid': userUid
      }
    },
    {
      '$lookup': {
        from: 'friends',
        localField: 'userUid',
        foreignField: 'userUid',
        as: 'friends'
      }
    }
  ]).exec((err, user) => {
    if (err) return res.status(500).send({
      message: `Error al realizar la petición: ${err}`
    })
    if (!user) {
      return res.status(404).send({
        message: `El user no existe`
      })
    } else {
      res.status(200).send({
        user
      })
    }
  })
}

module.exports = {
  signUp,
  signIn,
  getUsers,
  getUser
}
