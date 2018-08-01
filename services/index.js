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
      // externalId: user.externalId,
      title: user.title,
      step: '0'
    },
    iat: moment().unix(),
    exp: moment().add(40, 'minutes').unix()
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
      if (payload.exp <= moment().unix()) {
        reject({
          status: 401,
          message: 'Your token has expired'
        })
      }
      resolve(payload.sub)

    } catch (err) {
      reject({
        status: 500,
        message: 'Invalid token'
      })
    }
  })

  return decoded
}

module.exports = {
  createToken,
  decodeToken,
  sessionToken,
  sessionUUID,
  profile
}