'use strict'
const moment = require('moment')
const Agreement = require('../models/agreement')

const momentFunc = (array) => {
  array.forEach((obj) => {
    obj.initialDate = moment(obj.initialDate).format('YYYY - MM - DD');
    obj.completionDate = moment(obj.completionDate).format('YYYY - MM - DD');
  })
}

const getStatus = function(req, res) {
  let externalId = req.params.externalId;
  console.log('externalid : ' + externalId)

  Agreement.find({
      'externalId': externalId
    },
    null, {
      sort: {
        initialDate: -1
      }
    }, (err, agreement) => {
      if (err) return res.status(500).send({
        message: `Error executing action: ${err}`
      })
      if (!agreement) {
        return res.status(404).send({
          message: `The consentment is not existent`
        })
      } else {
        //console.log(user);
        momentFunc(agreement);
        res.status(200).send({
          agreement
        })
      }
    })
};


module.exports = {
  getStatus
};