'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config')


function createToken(user) {
  const payload = {
    sub: {
      userUid: user.userUid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profile: user.profile,
      externalId: user.externalId,
      title: user.title,
      step: '0'
    },
    iat: moment().unix(),
    exp: moment().add(30, 'minutes').unix()
  }
  return jwt.encode(payload, config.SECRET_TOKEN)
}

function sessionToken(token) {
  try {
    const payload = jwt.decode(token, config.SECRET_TOKEN_DECODE);
    //console.log(payload.sub);
    return payload.sub;
  } catch (err) {
    return (undefined);
  }
}

function externalId(token) {
  try {
    const payload = jwt.decode(token, config.SECRET_TOKEN_DECODE);
    var sub = payload.sub;
    var externalId = sub.externalId;
    return externalId;
  } catch (err) {
    return (undefined);
  }
}

function profile(token) {
  try {
    const payload = jwt.decode(token, config.SECRET_TOKEN_DECODE);
    var sub = payload.sub;
    var profile = sub.profile;
    return profile;
  } catch (err) {
    return (undefined);
  }
}

function sessionUUID(token) {
  try {
    const payload = jwt.decode(token, config.SECRET_TOKEN_DECODE);
    var sub = payload.sub;
    var UUID = sub.userUid;
    return UUID;
  } catch (err) {
    return (undefined);
  }
}

function decodeToken(token) {
  const decoded = new Promise((resolve, reject) => {

    try {
      const payload = jwt.decode(token, config.SECRET_TOKEN_DECODE)

      //console.log(payload)
      //console.log('payload')

      if (payload.exp <= moment().unix()) {
        //if (true){
        reject({
          status: 401,
          message: 'Votre token a expiré'
        })
      }
      resolve(payload.sub)

    } catch (err) {
      reject({
        status: 500,
        message: 'Token non valide'
      })
    }
  })

  //console.log('DECODED')
  //console.log(decoded)

  return decoded
}

module.exports = {
  createToken,
  decodeToken,
  sessionToken,
  sessionUUID,
  externalId,
  profile
}