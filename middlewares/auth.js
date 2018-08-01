'use strict'

const services = require('../services')

function isAuth (req, res, next) {

  console.log(req.headers.token);

  if (!req.headers.token) {
    return res.status(403).send({ message: "You're not autorised" })
  }


  const token = req.headers.token

  services.decodeToken(token)
    .then(response => {
      req.user = response
      next()
      console.log('Token non valide')
    })
    .catch(response => {
      return res.status(response.status).send({ message: 'Token non valide' })
    })
}

module.exports = isAuth
