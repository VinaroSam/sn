'use strict'

const services = require('../services')

function isAuth (req, res, next) {


  console.log(req.headers.token);

  if (!req.headers.token) {
    return res.status(403).send({ message: "Vous n'avez pas l'autorisation" })
  }


  // check header or url parameters or post parameters for token
  //var token = req.body.token || req.query.token || req.headers['x-access-token'];

  //const token = req.headers.authorization.split(' ')[1]

  const token = req.headers.token

  //console.log('EL TOKEN ');
  //console.log(token);

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
